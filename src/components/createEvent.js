import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import UserEventPage from "./userEvents";


function CreateEventPage(props){

    const refEventName = React.createRef() 
    const reftagline = React.createRef() 
    const refdesc = React.createRef() 
    const refsched = React.createRef() 
    const refEventMod = React.createRef() 
    const refEventCat = React.createRef() 
    const refEventFiles = React.createRef() 

    function validated(){
        if(refEventName.current.value.trim() == ""){
            
            alert("Enter Event Name")
            return false
        }

        if(refdesc.current.value.trim() == ""){
            alert("Enter Event description")
            return false
        }

        if(refsched.current.value.trim() == ""){
            alert("Enter Event date")
            return false
        }
        
        

        //when Event is updated input file is removed
        if(refEventFiles.current != null){
            if(refEventFiles.current.files.length == 0){
                let confirmNoFile =  window.confirm("You have not added Image. You cannnot update this later. Do you want to continue?");
                return confirmNoFile
            }
        }
            
        return true
        
        
    }


    async function submitEvent(){
         if(!validated())
            return;
        console.log(refEventName.current);
        let eventName = refEventName.current.value.trim()
        let eventTagline = reftagline.current.value || "Awesome event"
        let eventDescription = refdesc.current.value.trim()
        let eventSchedule = new Date(refsched.current.value)
        let eventModerator = refEventMod.current.value || "Krishnanand Shenoy"
        let eventCategory = refEventCat.current.value || "General"
        
        

        const fd = new FormData()
        fd.append("uid" , props.uid)
        fd.append("name" ,eventName)
        fd.append("tagline",eventTagline)
        fd.append("schedule",eventSchedule)
        fd.append("description",eventDescription)
        fd.append("moderator",eventModerator)
        fd.append("category",eventCategory)
       
            let eventFiles = refEventFiles.current.files.length ? refEventFiles.current.files[0] : null
            fd.append("eventImage",eventFiles)
            let res = await fetch("http://localhost:8000/api/v3/app/events/", {
                method: 'POST',
                body: fd
            })

            let data = await res.json()
            if(data.success!=true){
                alert("some error occured. Please try again.\nThe issue has been reported")
            }else{
                alert("Inserted one record")
                props.pageUpdater("UserEvents");
                refsched.current.value = ""
                refEventName.current.value = ""
                reftagline.current.value = ""
                refdesc.current.value = ""
                refEventMod.current.value = ""
                refEventCat.current.value = ""
                refEventFiles.current.value = null

            }
        
       

 
    }

    /*const offset = new Date().getTimezoneOffset() * 1000 * 60

    const getLocalDate = value => {
        const offsetDate = new Date(value).valueOf() - offset
        const date = new Date(offsetDate).toISOString()
        return date.substring(0, 16)
    }*/

    
  
        return(
            <div className="container-fluid h-100">
                <h1 align="center" className="w-100 align-center">Create Your Event Here</h1>
                <div className="container">
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="EventName" className="form-label fs-4">Event Name</label>
                        </div>
                        <div className="col">
                            <input className="form-control fs-5" ref={refEventName} id="EventName"></input>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="tagline" className="form-label fs-4">Event Tagline</label>
                        </div>
                        <div className="col">
                            <input className="form-control fs-5" ref={reftagline} id="tagline"></input>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="desc" className="form-label fs-4">Event Description</label>
                        </div>
                        <div className="col">
                            <textarea  className="form-control fs-5" ref={refdesc} id="desc" rows="3"></textarea >
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="sched" className="form-label fs-4">Event Schedule</label>
                        </div>
                        <div className="col">
                            <input type="datetime-local"  className="form-control fs-5" ref={refsched} id="sched" rows="3"></input >
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="EventMod" className="form-label fs-4">Event Moderator</label>
                        </div>
                        <div className="col">
                            <input className="form-control fs-5" ref={refEventMod} id="EventMod"></input>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="EventCat" className="form-label fs-4">Event Category</label>
                        </div>
                        <div className="col">
                            <input className="form-control fs-5" ref={refEventCat} id="EventCat"></input>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="EventFiles" className="form-label fs-4">Event Image</label>
                        </div>
                        <div className="col">
                            <input className="form-control" id="EventFiles" type="file" ref={refEventFiles}></input>
                        </div>
                        <div className="col">
                            <input className="form-control btn-primary" type="Button" value="Submit" readOnly  id="submit" onClick={submitEvent}></input>
                        </div>
                    </div>
                </div>
            </div>
        )
    
    
}


export  default CreateEventPage;