from fastapi import APIRouter,UploadFile,Form, Response,File
import sys
from typing import List
from config.firebase import firebase_instance
from config.db import conn
from models.user import User
import shutil
#from config.firebase import firebase
import cloudinary
import cloudinary.uploader
import cloudinary.api
import json
from fastapi.encoders import jsonable_encoder
# from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from demoEditv1 import main
from yolo_v3 import YOLO3
import tensorflow as tf
import os
from fastapi import FastAPI
from utils import gen_feature_known
from facedetection import gen_known_face_feats
from cloudinary.utils import cloudinary_url
import json
config = cloudinary.config(secure=True)





try:
     db=conn['reidentification']
     
except:
     raise("error occuring while connecting to database")
origins = [
    "http://localhost:3000",
    "localhost:3000"
]
user=APIRouter()
fastapi=FastAPI()
fastapi.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

    



@user.post('/uploadknownperson')


async def uploadknown(left: UploadFile = File(...),
                    right: UploadFile = File(...),
                    top: UploadFile = File(...),
                    bottom: UploadFile = File(...)
                          ):
    db.detectedPerson.delete_many({})
    db.logs.delete_many({})
#     pictures = [left,right,top,bottom]
    

#     filenames=[]
    



#     for i, picture in enumerate(pictures):
#         contents = await picture.read()
#         filename = f"picture{i+1}.jpg"  # You can use any naming convention you prefer
#         with open(filename, "wb") as f:
#             f.write(contents)
#         filenames.append(filename)
     
#     if gen_feature_known(filenames):
#          return {"upload":True}
#     else:
#          return {"upload":False}
        
@user.post('/getdates')
async def get_dates():
     unique_dates=set()
     detectedPerson=db.detectedPerson
     
     dates=detectedPerson.find({},{'_id':0,'date':1})
     for d in  dates:
          unique_dates.add(d['date'])
     return unique_dates
@user.get('/getlogs')
def create():
       detectedPerson=db.detectedPerson
     #   pipeline=[
     #       {'$addFields':{'_id':{ '$toString': '$_id' }}},{'$lookup':{'from':'logs','localField':'_id','foreignField':"detectedpersonID",'as'
     #                                                                  :'detectedPersonLogs'}},
     #       {'$unwind':{'path':'$detectedPersonLogs'}},
     #       {'$group':{'_id':{'personID':'$personID','detectedPersonlogsCameraNo':'$detectedPersonLogs.cameraNo'},
     #                  'imageURL':{'$first':'$imageURL'},'personID':{'$first':'$personID'},'date':{'$first':'$date'},'auth':{'$first':'$auth'}}},
     #        {'$match':{'date':'2023-05-17'}}]
       pipeline=[
          {'$addFields':{'_id':{ '$toString': '$_id' }}},{'$lookup':{'from':'logs','localField':'_id','foreignField':"detectedpersonID",'as'
                                                                     :'detectedPersonLogs'}},
          {'$unwind':{'path':'$detectedPersonLogs'}},
          {'$project':{'_id':1,'date':1,'personID':1,'imageURL':1,'auth':1,'detectedPersonLogs.cameraNo':1}}
          ]
      
            
           
       recordList=[]
       dp=detectedPerson.aggregate(pipeline)
     #   for d in dp:
     #        print(d)
     #   flag=False
     #   for d in dp:
     #        flag=False
     #        for record in recordList:
               
     #           if((d['personID']==record['personID'])):
     #                print("Hi")
     #                record['camNo'].append(d['detectedPersonLogs']['cameraNo'])
     #                flag=True
     #                break
                  
     #        if(not flag):
     #                recordObj=dict()
     #                recordObj={'imageURL':d['imageURL'],
     #                           'personID':d['personID'],
     #                           'auth':d['auth'],
     #                           'camNo': [d['detectedPersonLogs']['cameraNo']]

     #                             }
     #                print("Ariba", recordObj)
     #                recordObj['imageURL']=d['imageURL']
     #                recordObj['personID']=d['personID']
     #                recordObj['auth']=d['auth']
     #                recordObj['camNo']=[]
     #                recordObj['camNo'].append(d['detectedPersonLogs']['cameraNo'])
                    
     #
     # 
     #                 recordList.append(recordObj)
       flag=False
       for d in dp:
        flag = False
        for record in recordList:
           if d['_id'] == record['objectID']:
               if(d['personID']==record['personID']):
                 print("Hi")
                 record['camNo'].append(d['detectedPersonLogs']['cameraNo'])
                 flag = True
                 break
   
        if not flag:
           recordObj = {
                'objectID':d['_id'],
               'imageURL': d['imageURL'],
               'personID': d['personID'],
               'publicId':d['date'],
               'date':d['date'],
               'auth': d['auth'],
               'camNo': [d['detectedPersonLogs']['cameraNo']]
           }
           print("Ariba", recordObj)
           recordList.append(recordObj)
     
       return recordList   
     #   for i  in range(0,len(recordList)-1):
     #        for j in range(i+1,len(recordList)):
     #             if(recordList[i]['personID']==recordList[j]['personID']):
     #                  recordList[i]['camNo']=[recordList[i]['detectedPersonLogs']['cameraNo'],recordList[j]['detectedPersonLogs']['cameraNo']]
     #                  recordList.remove(recordList[j])
     #             else:
     #                   recordList[i]['camNo']=[recordList[i]['detectedPersonLogs']['cameraNo']]
                      
            
     #   return recordList
     #   detectedPersonIDList=[]
     #   print("dp")
     #   for d in dp:
      
           
           
     #       dect_person_id=d['_id']['personID']
     #       if dect_person_id not in detectedPersonIDList:
     #          detectedPersonIDList.append(dect_person_id)
     #          recordObj[dect_person_id]={'personID':dect_person_id,"imageURL":d['imageURL'],'date':d['date'],"count":[1],'auth':d['auth']}
     #       else:
     #            count=recordObj[dect_person_id]["count"]
     #            camCount=count[-1]
     #            recordObj[dect_person_id]["count"].append(camCount+1)
           
     #   for record in recordObj:
     #       arr.append(recordObj[record])     
     #   return (arr)


@user.post('/signup')
async def create_user(email:str=Form(...),password:str=Form(...)):
     
     auth=firebase_instance.auth()
     
     if(len(password)>=6):
          try:
               user_info=auth.create_user_with_email_and_password(email,password)
               
               
               email=auth.send_email_verification(user_info['idToken'])
               if(email):
                 
                 return({"signup":True})
               else:
                   if(user_info):
                     auth.delete_user_account(user_info['idToken'])
                   return({"signup":False})


          except:
               
               return({"signup":False})
     else:
          return({"signup":False})
@user.post('/login')               
def login_user(email:str=Form(...),password:str=Form(...)):
     auth=firebase_instance.auth()
     try:
          user=auth.sign_in_with_email_and_password(email,password)
          if(user):
               return ({"login":True})
          else:
               return ({"login":False})
          
     except:
          return({"login":False})
     

@user.post('/upload_videos')
async def upload_videos(files:List[UploadFile],date:str= Form(...)):
    #checking date from backend
     unique_dates=set()
     detectedPerson=db.detectedPerson
     
     dates=detectedPerson.find({},{'_id':0,'date':1})
     for d in  dates:
          unique_dates.add(d['date'])
     if date in unique_dates:
          return {"identification":"false"}
     else:
         
      camera_no=0
      videos_path=[]
      #curr_date=str(date.today())
      for file in files:
           camera_no+=1
           file_path="D:\\FYP-1\\Backend\\videos\Init\\"+str(camera_no)+"_"+date+".mp4"
           with open(file_path,"wb") as buffer:
                 shutil.copyfileobj(file.file,buffer)
      for i in range(camera_no):
           videos_path.append("videos\\Init\\"+str(i+1)+"_"+date+".mp4")
      gpu_options = tf.compat.v1.GPUOptions(per_process_gpu_memory_fraction=0.3)
      sess = tf.compat.v1.Session(config=tf.compat.v1.ConfigProto(gpu_options=gpu_options))
      #main(date,yolo=YOLO3(),videos=videos_path,all=True)
 
      finalOccurance,isKnown,complete_video_path=main(date,yolo=YOLO3(),videos=videos_path,all=True)
      finalOccurance={1:[1,3],2:[1]}
      
      isKnown={1:True,3:False}
      
 
      finalLabelPath='boundingBoxes//finalLabels//'
      imageURL=[]
      
      for currDir in os.listdir(finalLabelPath):
      
           if(currDir==date):
                for file in os.listdir(finalLabelPath+currDir):
                     if('_15_'+date in file):
                        try:
                          upload=cloudinary.uploader.upload(finalLabelPath+currDir+"//"+file, public_id=file, unique_filename = False, overwrite=True)
                       
                # Build the URL for the image and save it in the variable 'srcURL'
                          imageURL.append(upload['secure_url'])
                        except:
                          return({"error":"error uploading images to cloud"})
                     
      print(imageURL)              
      counter=0
      logs=db.logs
      
  
      insertedID=[]
      for key,item in finalOccurance.items():
              
              
              for i in item:
                
                    if i not in insertedID:
                        
                        for URL in imageURL:
                             if (str(i)+'_'+'15'+'_'+date+'.png') in URL:
                                  index=imageURL.index(URL)
                                  
                                  break
                        
                        try:
                         _id= detectedPerson.insert_one({"personID":i,"imageURL":imageURL[index],"date":date,"auth":isKnown[i]})
                         print(_id.inserted_id)
                        except:
                             print("error occuring in inserting data")
                        counter=counter+1
                        insertedID.append(i)
                        
              
             
     
      
      for key,value in finalOccurance.items():
               
                for v in value:
                
                        personObjectID=detectedPerson.find_one({"personID":v,"date":date},{"_id":1})
                        print(personObjectID)
                        logID=logs.insert_one({"cameraNo":key,"detectedpersonID": str(personObjectID["_id"])})
                        print(logID)
     result = cloudinary.uploader.upload(os.path.join(os.getcwd(),complete_video_path),public_id=date,resource_type="video")
     print(result['public_id'])
     return {"identification":True}
     
     

          
          
          
              
                
     
     
     




          
          
          
          
     
     

