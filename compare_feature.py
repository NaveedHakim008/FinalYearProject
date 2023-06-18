import torch
import torchreid
from reid import REID
import numpy as np
import os

def feature_reader(feature_path)->dict:
    known_person_feats={}
    for file in os.listdir(feature_path):
        filename=os.path.join(feature_path,file)
        feature_tensor=torch.load(filename)
        id=file.replace('.pt','')
        known_person_feats[id]=feature_tensor
    return known_person_feats[id]



def compare_features(feature_path,unkown_person_feature)->dict:
    reid=REID()
    threshold=320
    isknown={} #dictionary of boolean 


    known_person_feature=feature_reader(feature_path)
    for key,value in unkown_person_feature.items():
        for val in value:
         print(type(val))
         unknown_person_feats=val
         unknown_person_id=key
         known_score=0
         for key,value in known_person_feature.items():
            known_person_feat=value
            distance=reid.compute_distance(unknown_person_feats,known_person_feat)
            if(np.mean(distance) < threshold):
                known_score+=1
        if(known_score>=2):
                isknown[unknown_person_id]=True
                 
        if(unknown_person_id not in [key for key in isknown.keys()]):
            isknown[unknown_person_id]=False
    return isknown
        
                



    
if __name__ == '__main__':
    feature_reader('features')