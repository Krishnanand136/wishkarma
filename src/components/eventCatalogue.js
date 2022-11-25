import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import EventCards from "./eventCards";

class EventCataloguePage extends React.Component{
  constructor(){
    super()
    this.state = {
      createdEventsJsx : <></> ,
      count : 0,
      limit : 4
      
    }
    this.initialLimit = this.state.limit
    this.loadMoreJSX = <></>
  }

  handleShowMoreEvents = () =>{
    this.setState({limit : this.state.limit + this.initialLimit , count:0})
  }
  handleShowLessEvents = () =>{
    this.setState({limit :this.initialLimit , count:0})
  }

  createCardsJSX(data){
    let table = []
    let tempJSX = []
    let cardsPerRow = 4
    
    
        
        for (let r = 0; r<parseInt(data.length/cardsPerRow) ; r++){
            let rows = []
            for(let c = r*cardsPerRow ; c< (r+1)*cardsPerRow ; c++)
                rows.push(<EventCards data={data[c]} parentPage="eventCatalogue"/>)
            table.push(rows);
        }

        let rows = []
        let c = data.length - data.length%cardsPerRow
        for( ; c<data.length ; c++){
            rows.push(<EventCards data={data[c]} parentPage="eventCatalogue"/>)
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
                      {tempJSX}
                </div>
        })
    
  }


  eventsCreated(){
        if(this.state.count != 0)
            return

            fetch(`http://localhost:8000/api/v3/app/events/`)
            .then((data)=>{
          
                  data.json().then((results)=>{

                    if(results.data.length == 0){
                        this.loadMoreJSX = <></>
                    }else{
                        if(results.data.length >this.state.limit){
                          this.loadMoreJSX = <button className="btn  btn-outline-primary btn-lg w-100" onClick={this.handleShowMoreEvents}>Show More</button>
                        }else{
                          this.loadMoreJSX = <button className="btn  btn-outline-primary btn-lg w-100" onClick={this.handleShowLessEvents}>Show Less</button>
                        }
                    }
            })

                     
          
            }).catch((e)=>alert("Could not fetch"))

        fetch(`http://localhost:8000/api/v3/app/events/?limit=${this.state.limit}&&page=0`, {
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
                            this.setState({count:1})
                        }
                    }
                })
                
        })

  }


  

  render(){
        
    this.eventsCreated()
    return(
            <div className="contaier-fluid"> 
              {this.state.createdEventsJsx}
              <div className="container-fluid mb-5">{this.loadMoreJSX}</div>
            </div>
  
  )
  }

}

export  default EventCataloguePage;