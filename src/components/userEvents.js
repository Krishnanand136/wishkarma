import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState , useEffect } from 'react';
import EventCards from "./eventCards";
import Modal from 'react-bootstrap/Modal';




class UserEventPage extends React.Component{
    

    constructor(props){
        super(props)
        this.props = props
        this.state = {
            count : 0 ,
            createdEventsJsx : <></>,
            updatedCard : 0,
            modalShow : false
        }
        this.modalEventId = ""

        this.refEventName = React.createRef() 
        this.reftagline = React.createRef() 
        this.refdesc = React.createRef() 
        this.refsched = React.createRef() 
        this.refEventMod = React.createRef() 
        this.refEventCat = React.createRef() 
        this.modalHeading = ""

    }


    validated(){
        if(this.refEventName.current.value.trim() == ""){
            
            alert("Enter Event Name")
            return false
        }

        if(this.refdesc.current.value.trim() == ""){
            alert("Enter Event description")
            return false
        }

        if(this.refsched.current.value.trim() == ""){
            alert("Enter Event date")
            return false
        }
        
        return true
        
        
    }


    submitEvent = async ()=>{
         if(!this.validated())
            return;
        
        let eventName = this.refEventName.current.value.trim()
        let eventTagline = this.reftagline.current.value || "Awesome event"
        let eventDescription = this.refdesc.current.value.trim()
        let eventSchedule = new Date(this.refsched.current.value)
        let eventModerator = this.refEventMod.current.value || "Krishnanand Shenoy"
        let eventCategory = this.refEventCat.current.value || "General"
        
        

        const fd = new FormData()
        fd.append("uid" , this.props.uid)
        fd.append("name" ,eventName)
        fd.append("tagline",eventTagline)
        fd.append("schedule",eventSchedule)
        fd.append("description",eventDescription)
        fd.append("moderator",eventModerator)
        fd.append("category",eventCategory)
        
            let res = await fetch(`http://localhost:8000/api/v3/app/events/${this.modalEventId}`, {
                method: 'put',
                body: fd
            })

            let data = await res.json()
            if(data.message == "some error occured"){
                alert("Some eroor occured pls try again later")
            }else{
                alert("updated one record")
            }
            
            this.setState({"modalShow":false , count : 0})    
    }



    handleModalClose = () =>{
        this.modalEventId = ""
        this.setState({"modalShow":false})
    }
    handleModalOpen = (cardData) =>{
        this.setState({"modalShow":true} , ()=>{

            const offset = new Date().getTimezoneOffset() * 1000 * 60

            const getLocalDate = value => {
                const offsetDate = new Date(value).valueOf() - offset
                const date = new Date(offsetDate).toISOString()
                return date.substring(0, 16)
            }

            this.refEventName.current.value = cardData.ename
            this.reftagline.current.value = cardData.tagline
            this.refdesc.current.value = cardData.description
            this.refsched.current.value = getLocalDate(cardData.schedule)
            this.refEventMod.current.value = cardData.moderator
            this.refEventCat.current.value = cardData.category
            this.modalEventId = cardData._id
            
        })
        
        
    }

    setUpdatedCard = () =>{
        this.setState({ count:0});
    }

    setSubmitWhenUpdated = () =>{
        this.setState({updateEventJSX:<></> , count:0})
    }
    



    createCardsJSX(data){
        let table = []
        let tempJSX = []
        let cardsPerRow = 4
        
        
            
            for (let r = 0; r<parseInt(data.length/cardsPerRow) ; r++){
                let rows = []
                for(let c = r*cardsPerRow ; c< (r+1)*cardsPerRow ; c++)
                    rows.push(<EventCards data={data[c]} parentPage="userEvents" renderDeleted = {this.setUpdatedCard} showModal = {this.handleModalOpen}/>)
                table.push(rows);
            }

            let rows = []
            let c = data.length - data.length%cardsPerRow
            for( ; c<data.length ; c++){
                rows.push(<EventCards data={data[c]} parentPage="userEvents"  renderDeleted = {this.setUpdatedCard} showModal = {this.handleModalOpen}/>)
            }
            table.push(rows)
            

            for(let i = 0; i<table.length ; i++){
                tempJSX.push(
                    <div className="container-fluid d-flex">
                        {table[i]}
                    </div>
                )
            }





            this.setState({createdEventsJsx : 
                    <div className="container-fluid">
                        <p className="w-100 h3">Events Created by you</p>
                            <div className="container-fluid">
                                {tempJSX}
                            </div>
                    </div>
            })
        
    }

    
    eventsCreated(){
        if(this.state.count != 0)
            return
        fetch(`http://localhost:8000/api/v3/app/events/userCreated/${this.props.uid}`, {
            method: 'get',
            headers:{
                "accept" : "*/*"
            }
        }).then((res)=>{
                res.json().then((results)=>{
                    if(results.success!=true){
                        alert("Try again. Some issues has occured. It has been reported")
                    }else{
                        
                        if(results.data.length>0){
                            this.createCardsJSX(results.data);
                            this.setState({"count": this.state.count+1})
                        }
                    }
                })
                
        })

    }
    
   

    render(){
        
            this.eventsCreated()
            return(
                <>
                    <div className="contaier-fluid"> 
                        <div>{this.state.createdEventsJsx}</div>
                    </div>

                    
                    <Modal show={this.state.modalShow}  onHide={(e)=>this.setState({"modalShow" : false})}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.modalHeading}</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>

                        <div className="container">
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="eventNameUpdate" className="form-label fs-4">Event Name</label>
                                </div>
                                <div className="col">
                                    <input className="form-control fs-5" ref={this.refEventName} id="eventNameUpdate"></input>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="eventTaglineUpdate" className="form-label fs-4">Event Tagline</label>
                                </div>
                                <div className="col">
                                    <input className="form-control fs-5" ref={this.reftagline} id="eventTaglineUpdate"></input>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="eventDescriptionUpdate" className="form-label fs-4">Event Description</label>
                                </div>
                                <div className="col">
                                    <textarea  className="form-control fs-5" ref={this.refdesc} id="eventDescriptionUpdate" rows="3"></textarea >
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="eventScheduleUpdate" className="form-label fs-4">Event Schedule</label>
                                </div>
                                <div className="col">
                                    <input type="datetime-local"  className="form-control fs-5" ref={this.refsched} id="eventScheduleUpdate" rows="3"></input >
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="eventModeratorUpdate" className="form-label fs-4">Event Moderator</label>
                                </div>
                                <div className="col">
                                    <input className="form-control fs-5" ref={this.refEventMod} id="eventModeratorUpdate"></input>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="eventCategoryUpdate" className="form-label fs-4">Event Category</label>
                                </div>
                                <div className="col">
                                    <input className="form-control fs-5" ref={this.refEventCat} id="eventCategoryUpdate"></input>
                                </div>
                            </div>
                        </div>



                        </Modal.Body>

                        <Modal.Footer>
                            <button variant="secondary" onClick={this.handleModalClose}>
                                Close
                            </button>
                            <button variant="primary"  onClick={this.submitEvent}>
                                Save Changes
                            </button>
                            </Modal.Footer>
                    </Modal>
                </>
            )
        

        
    }


}






export  default UserEventPage;