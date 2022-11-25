import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';


class EventCards extends React.Component{
    constructor(props){
        super(props);
        this.props = props
        this.state = {
            "count" : 0,
            "img": "",
        }
        if(props.parentPage == "userEvents"){
            this.editButtons = <div className="col mb-4 ms-3">
                                    <span className="btn btn-sm btn-primary mx-1" onClick={()=>this.props.showModal(this.props.data)}>update Event</span>
                                    <span  className="btn btn-sm btn-primary" onClick={this.deleteMe}>Delete Event</span>
                                </div>
        }
        else{
            this.editButtons = <></>
        }
    }

    deleteMe= ()=>{
        fetch(`http://localhost:8000/api/v3/app/events/${this.props.data._id}`, {
            method: 'delete',
        }).then((res)=>{
                this.props.renderDeleted();
        })
    }

    getImage = async()=>{
        if(this.state.count!=0)
            return
        let res = await fetch(`http://localhost:8000/api/v3/app/events/userCreated/image/${this.props.data._id}`)
        let img = await res.blob()
        if(img.type !== 'application/json'){
            img = URL.createObjectURL(img)
        }
        this.setState({"img":img , "count" : this.state.count+1} , ()=>{
        })
        
    }

    showButtons(){
        return <div className="col mb-4 ms-3">
                    <span className="btn btn-sm btn-primary mx-1" onClick={()=>this.props.showModal(this.props.data)}>update Event</span>
                    <span  className="btn btn-sm btn-primary" onClick={this.deleteMe}>Delete Event</span>
                </div>  
    }

    render(){


        if(this.props.data.file == undefined){
        return(
            <>
            <div className="card m-2" style={{width : "25%"}}>
                <div className="card-body">
                    <h5 className="card-title">{this.props.data.ename}</h5>
                    <p className="card-text">{this.props.data.description}</p>
                </div>
                {this.editButtons} 
            </div>
            </>
        )



        }else{

        this.getImage()
        return(
            <>
            <div className="card m-2" style={{width : "25%"}}>
                <img className="card-img-top" src={this.state.img} alt="IH"/>
                <div className="card-body">
                    <h5 className="card-title">{this.props.data.ename}</h5>
                    <p className="card-text">{this.props.data.description}</p>
                </div>
                {this.editButtons} 
                
            </div>
            </>
        )
        }
    }
}


export  default EventCards;