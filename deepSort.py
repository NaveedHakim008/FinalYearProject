from yolo_v3 import YOLO3
from PIL import Image
from deep_sort import preprocessing
from deep_sort import nn_matching
from deep_sort.detection import Detection
from deep_sort.tracker import Tracker
from tools import generate_detections as gdet
from deep_sort.detection import Detection as ddet
import numpy as np
from utils import get_color,get_FrameLabels,cv2_saveBox,cv2_addBox
from typing import Tuple


def deepSort(bb_dir:str,yolo,frameDict:dict,date:str,w:int or float,h:int or float)->Tuple[list,dict,dict,dict]:
    length=0
    for key,values in frameDict.items():
        length+=len(values)
    print(length)
    max_cosine_distance = 0.2
    nn_budget = None
    nms_max_overlap = 0.4
    frame_cnt=0
    model_filename = 'model_data/models/mars-small128.pb'
    encoder = gdet.create_box_encoder(model_filename, batch_size=1)  # use to get feature

    metric = nn_matching.NearestNeighborDistanceMetric("cosine", max_cosine_distance, nn_budget)
    tracker = Tracker(metric, max_age=1000)
    track_cnt = dict()
    cameraNumber = 0
    images_by_id = dict()
    ids_per_frame = []
    cameraOccurance = dict()
    for key, values in frameDict.items():
        #cameraNumber = cameraNumber + 1
        for frame in values:
    # for frame in all_frames:           
            image = Image.fromarray(frame[..., ::-1])  # bgr to rgb
            boxs = yolo.detect_image(image)  # n * [topleft_x, topleft_y, w, h]
            features = encoder(frame, boxs)  # n * 128
            detections = [Detection(bbox, 1.0, feature) for bbox, feature in zip(boxs, features)]  # length = n
            text_scale, text_thickness, line_thickness = get_FrameLabels(frame)

            # Run non-maxima suppression.
            boxes = np.array([d.tlwh for d in detections])
            scores = np.array([d.confidence for d in detections])
            indices = preprocessing.delete_overlap_box(boxes, nms_max_overlap, scores)
            # indices = preprocessing.non_max_suppression(boxes, nms_max_overlap, scores)
            detections = [detections[i] for i in indices]  # length = len(indices)

            # Call the tracker
            tracker.predict()
            tracker.update(detections)

            tmp_ids = []
            for track in tracker.tracks:
                if not track.is_confirmed() or track.time_since_update > 1:
                    continue

                bbox = track.to_tlbr()
                area = (int(bbox[2]) - int(bbox[0])) * (int(bbox[3]) - int(bbox[1]))
                if bbox[0] >= 0 and bbox[1] >= 0 and bbox[3] < h and bbox[2] < w:
                    tmp_ids.append(track.track_id)
                    if track.track_id not in track_cnt:

                       
                        if track.track_id in cameraOccurance.keys():
                            cameraOccurance[key].append(track.track_id)
                        else:    
                            cameraOccurance[key] = [track.track_id]
                        
                        track_cnt[track.track_id] = [
                            [frame_cnt, int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3]), area,
                            cameraNumber]
                        ]
                        
                        cv2_saveBox(
                            track.track_id,
                            frame,
                            cameraNumber,
                            int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3]),
                            line_thickness,
                            text_thickness,
                            text_scale,
                            bb_dir,date
                        )


                        # print(track_cnt[track.track_id])
                        #bounding boxes input to images_by_id

                        images_by_id[track.track_id] = [(frame[int(bbox[1]):int(bbox[3]), int(bbox[0]):int(bbox[2])],key)]
          
                    else:
                        track_cnt[track.track_id].append([
                            frame_cnt, 
                            int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3]),
                            area, cameraNumber
                        ])
                        # print(track_cnt[track.track_id])
                        images_by_id[track.track_id].append((frame[int(bbox[1]):int(bbox[3]), int(bbox[0]):int(bbox[2])],key))
                cv2_addBox(
                    track.track_id,
                    frame,
                    int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3]),
                    line_thickness,
                    text_thickness,
                    text_scale
                )
              
            ids_per_frame.append(set(tmp_ids))
            
            # save a frame
          
            print(tmp_ids,frame_cnt)
            frame_cnt += 1

            
    return ids_per_frame,track_cnt,images_by_id,cameraOccurance

