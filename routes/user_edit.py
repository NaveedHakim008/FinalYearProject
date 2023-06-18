from fastapi import APIRouter,UploadFile,Form, Response
import sys
from typing import List
#from config.firebase import firebase_instance
from config.db import conn
from models.user import User
import shutil

from fastapi.middleware.cors import CORSMiddleware

import json
from fastapi.encoders import jsonable_encoder
# from fastapi.responses import JSONResponse
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from demoEdit import main
from yolo_v3 import YOLO3
import tensorflow as tf
import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
import json
from fastapi import FastAPI



config = cloudinary.config(secure=True)

try:
     db=conn['reidentification']
except:
     raise("error occuring while connecting to database")
use = FastAPI()
use.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
user=APIRouter()
use.include_router(user)


# @user.post('/signup')
# def create_user(user: User):
#      auth=firebase_instance.auth()
#      if(len(user.password)>=6):
#           try:
#                auth.create_user_with_email_and_password(user.emailAddress,user.password)
#                return({"msg":"sigup successful"})
#           except:
#                return({"error":"email must be unique"})
#      else:
#           return({"error":"password must be greater than 6 letter"})
# @user.post('/login')               
# def login_user(user: User):
#      auth=firebase_instance.auth()
#      try:
#           auth.sign_in_with_email_and_password(user.emailAddress,user.password)
#           return{"msg":"sigin successful"}
#      except:
#           return{"error":"emailAddress or password is not valid ! Please Try Again"}
     

@user.post('/upload_videos')
async def upload_videos(files:List[UploadFile],date:str= Form(...)):
    
     # camera_no=0
     # videos_path=[]
     # #curr_date=str(date.today())
     # for file in files:
     #      camera_no+=1
     #      file_path="C:\\Users\\Ariba\\Documents\\Ariba\\Career\\FAST-NUCES\\FYP - Final Year Project\\ReIdentification-FYP\\Backend\\videos\Init\\"+str(camera_no)+"_"+date+".mp4"
     #      with open(file_path,"wb") as buffer:
     #            shutil.copyfileobj(file.file,buffer)
     # for i in range(camera_no):
     #      videos_path.append("videos\\Init\\"+str(i+1)+"_"+date+".mp4")
     # gpu_options = tf.compat.v1.GPUOptions(per_process_gpu_memory_fraction=0.3)
     # sess = tf.compat.v1.Session(config=tf.compat.v1.ConfigProto(gpu_options=gpu_options))
     # finalOccurance=main(date,yolo=YOLO3(),videos=videos_path,all=True)
     
     # finalLabelPath='boundingBoxes//finalLabels//'
     # imageURL=[]
     # for currDir in os.listdir(finalLabelPath):
     #      if(currDir==date):
     #           for file in os.listdir(finalLabelPath+currDir):
     #                try:
     #                  cloudinary.uploader.upload(finalLabelPath+currDir+"//"+file, public_id=file, unique_filename = False, overwrite=True)
                  
     #           # Build the URL for the image and save it in the variable 'srcURL'
     #                  srcURL = cloudinary.CloudinaryImage(file).build_url()
     #                  imageURL.append(srcURL)
     #                except:
     #                     return({"error":"error uploading images to cloud"})
     # print(imageURL)               
                    
     # counter=0
     # detectedPerson=db.detectedPerson
     # logs=db.logs
     # insertedID=[]
     # # FINAL OCCURENCE = CAMERA id WITH RESPECTIVE LABEL ID
     # for key,item in finalOccurance.items():
     #         for i in item:
     #              if i not in insertedID:
     #                   detectedPerson.insert_one({"personID":i,"imageURL":imageURL[0],"date":date})
     #                   counter=counter+1
     #                   insertedID.append(i)
                       
             
            
     
     # try:
     #    for key,value in finalOccurance.items():
              
     #           for v in value:
               
     #                   personObjectID=detectedPerson.find_one({"personID":v},{"_id":1})
     #                   logs.insert_one({"cameraNo":key,"detectedpersonID": str(personObjectID["_id"])})
     # except:
     #      return({"error:error occuring in querying and inserting in database"})
     # pipeline=[
     #      {'$addFields':{'_id':{ '$toString': '$_id' }}},{'$lookup':{'from':'logs','localField':'_id','foreignField':"detectedpersonID",'as'
     #                                                                 :'detectedPersonLogs'}},
     #      {'$unwind':{'path':'$detectedPersonLogs'}},
     #      {'$project':{'_id':0,'date':1,'personID':1,'imageURL':1,'detectedPersonLogs.cameraNo':1}},{'$match':{'date':date}}
     #      ]
     # dp=detectedPerson.aggregate(pipeline)
     
     # recordList=[]
     # flag=False
     # for d in dp:
     #        flag=False
     #        for record in recordList:
               
     #           if((d['personID']==record['personID'])):
     #                record['camNo'].append(d['detectedPersonLogs']['cameraNo'])
     #                flag=True
     #                break
                  
     #        if(not flag):
     #                recordObj=dict()
     #                recordObj['imageURL']=d['imageURL']
     #                recordObj['personID']=d['personID']
     #                recordObj['camNo']=[]
     #                recordObj['camNo'].append(d['detectedPersonLogs']['cameraNo'])
     #                recordList.append(recordObj)
     
     recordList = [{
          "id": 1,
          "Name": "Ariba",
          "Age": 21,
          "Semester": 8
     },
     {
          "id": 2,
          "Name": "Anjiya",
          "Age": 21,
          "Semester": 8
     },
     {
          "id": 3,
          "Name": "Naveed",
          "Age": 21,
          "Semester": 8
     }
     ]
     print(recordList)  
     # json_compatible_item_data = jsonable_encoder(recordList)
     return recordList
        

     
          
          
          
              
                
     
     
     




          
          
          
          
     
     

