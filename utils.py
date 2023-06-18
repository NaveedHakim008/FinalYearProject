import os
import cv2
import torch
import torchreid
from reid import REID
import numpy as np
from pixellib.tune_bg import alter_bg


def feature_reader(feature_path)->dict:
    known_person_feats=[]
    for file in os.listdir(feature_path):
        filename=os.path.join(feature_path,file)
        feature_tensor=torch.load(filename)
        known_person_feats.append(feature_tensor)

    return known_person_feats

def gen_feature_known(pictures):
    
    gray_scale_frame=[]
    change_bg = alter_bg(model_type = "pb")
    try:
      change_bg.load_pascalvoc_model("./model_data/models/xception_pascalvoc.pb")
    except:
        return False
    try:
      for picture in pictures:
        
     
        change_bg.color_bg(picture, colors=(0, 0, 0), output_image_name=os.getcwd()+'\\known_bg_black\\'+picture)
    except:
        return False
    path=os.getcwd()+"\\known_bg_black\\"
    for file in os.listdir(path):
          print(file)
          frame=cv2.imread(os.path.join(path,file))
          gray_frame=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
        
          gray_scale_frame.append(gray_frame)
    reid=REID()
    feats=reid._features(gray_scale_frame)
    print(feats.shape)
    feature_path=os.getcwd()+"\\features\\"
    person_id=0    
    for files in os.listdir(feature_path):
        person_id+=1
    
    torch.save(feats,feature_path+str(person_id)+'.pt')
    
    feats=torch.load(feature_path+str(person_id)+'.pt')
    if feats.shape[0] ==len(gray_scale_frame):
      return True    




def compare_features(unkown_person_feature)->dict:
    reid=REID()
    threshold=320
    isknown={} #dictionary of boolean 


    known_person_feature=feature_reader(os.getcwd()+"\\features\\")
    for key,value in unkown_person_feature.items():
        unknown_person_feat=value
        if(unknown_person_feat is None):
            isknown[key]=False
        else:
         unknown_person_id=key
         for known_person_feats in known_person_feature:
             
             distance=reid.compute_distance(unknown_person_feat,known_person_feats)
             print('distance:',distance)
             if(np.mean(distance) < 320):
                 isknown[unknown_person_id]=True
                 
         if(unknown_person_id not in [key for key in isknown.keys()]):
            isknown[unknown_person_id]=False
    return isknown

def get_FrameLabels(frame):
    text_scale = max(2, frame.shape[1] / 1600.)
    text_thickness = 2 if text_scale > 1.1 else 2
    line_thickness = max(2, int(frame.shape[1] / 500.))
    return text_scale, text_thickness, line_thickness


def cv2_addBox(track_id, frame, x1, y1, x2, y2, line_thickness, text_thickness, text_scale):
    

    color = get_color(abs(track_id))
    cv2.rectangle(frame, (x1, y1), (x2, y2), color=color, thickness=line_thickness)
    cv2.putText(
        frame, str(track_id), (x1, y1 + 30), cv2.FONT_HERSHEY_PLAIN, text_scale, (0, 0, 255), thickness=text_thickness)

# saving bounding box in folder
def cv2_saveBox(track_id, frame, cameraId, x1, y1, x2, y2, line_thickness, text_thickness, text_scale, bb_dir,date):
    
    color = get_color(abs(track_id))
    boxImage = cv2.rectangle(frame, (x1, y1), (x2, y2), color=color, thickness=line_thickness)
    cv2.putText(
        frame, str(track_id), (x1, y1 + 30), cv2.FONT_HERSHEY_PLAIN, text_scale, (0, 0, 255), thickness=text_thickness)
    #rgb = cv2.cvtColor(boxImage, cv2.COLOR_BGR2RGB)
    #rgb=cv2.cvtColor(bgr,cv2.COLOR_BGR2RGB)
    crop =frame[y1:y2, x1:x2]

  
     
    imageName = str(track_id) + "_" + str(cameraId) + "_" + date + '.png'
    #print(imageName)
    # cv2.imshow('imageName', crop)
    # key = cv2.waitKey(5000)
    cv2.imwrite(
        'D:\\FYP-1\\Backend\\'
        + bb_dir
        + imageName,
        crop)



def write_feature(filename:str,features):
    torch.save(features,filename)
   
    # print('save results to {}'.format(filename))




def get_color(idx):
    idx = idx * 3
    color = ((37 * idx) % 255, (17 * idx) % 255, (29 * idx) % 255)
    return color
