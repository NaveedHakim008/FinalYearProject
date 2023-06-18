import os
import pixellib
from pixellib.tune_bg import alter_bg
def removeBackground(videos:list,date:str)->list:
    cwd=os.getcwd()
    print(cwd)
    remove_bg_dir=cwd+"\\remove_bg_videos\\"
    #making new directory for storing videos without background
    if not os.path.exists(remove_bg_dir):
        os.mkdir(remove_bg_dir)
    counter=0
    change_bg = alter_bg(model_type = "pb")
    change_bg.load_pascalvoc_model("./model_data/models/xception_pascalvoc.pb")
    remove_bg_vid=[]

    for video in videos:
        counter=counter+1
        remove_bg_vid_path=remove_bg_dir+"outputVideo_"+date+"_"+str(counter)+".mp4"
        change_bg.color_video(video, colors =  (0, 0, 0), frames_per_second=30, output_video_name=remove_bg_vid_path, detect = "person")
    remove_bg_vid=[]
    for file in os.listdir(remove_bg_dir):
        if os.path.isfile(os.path.join(remove_bg_dir, file)):
            if(file.__contains__(date)):
                remove_bg_vid.append(os.path.join(remove_bg_dir,file))
    return remove_bg_vid