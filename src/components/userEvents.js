import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState , useEffect } from 'react';
import EventCards from "./eventCards";
import CreateEventPage from "./createEvent";



class UserEventPage extends React.Component{
    

    constructor(props){
        super(props)
        this.props = props
        this.state = {
            count : 0 ,
            createdEventsJsx : <></>,
            updateEventJSX : <></>,
            updatedCard : 0
        }
        
    }

    setUpdatedCard = () =>{
        this.setState({ count:0});
    }

    setSubmitWhenUpdated = () =>{
        this.setState({updateEventJSX:<></> , count:0})
    }
    

    setUpdateEventJSX = (data=null , img=null) =>{
        this.setState({updateEventJSX:<CreateEventPage pageUpdater={this.setSubmitWhenUpdated} uid = {this.props.uid} data = {data} img={img}/>, count:0}) 
    }


    createCardsJSX(data){
        let table = []
        let tempJSX = []
        let cardsPerRow = 4
        
        
            
            for (let r = 0; r<parseInt(data.length/cardsPerRow) ; r++){
                let rows = []
                for(let c = r*cardsPerRow ; c< (r+1)*cardsPerRow ; c++)
                    rows.push(<EventCards data={data[c]} setUpdatedCard = {this.setUpdatedCard} updateEvent = {this.setUpdateEventJSX}/>)
                table.push(rows);
            }

            let rows = []
            let c = data.length - data.length%cardsPerRow
            for( ; c<data.length ; c++){
                rows.push(<EventCards data={data[c]} setUpdatedCard = {this.setUpdatedCard} updateEvent = {this.setUpdateEventJSX}/>)
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
                    {this.state.updateEventJSX}
                    <div className="contaier-fluid"> 
                        <div>{this.state.createdEventsJsx}</div>
                    </div>
                </>
            )
        

        
    }


}






export  default UserEventPage;