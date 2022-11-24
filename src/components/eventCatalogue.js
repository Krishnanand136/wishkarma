import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';



class EventCataloguePage extends React.Component{


  constructor(){
    super()
    this.limit = React.createRef()
    this.state = {
        tableJSX : <></>,
        paginationJSX : <></>,
        pageSelected : 0,
        limitEntered : 5
    }
    this.count = 0
    
  }

  

  fetchEvents(){
    if(this.count != 0)
      return
    

    let rowsPage = []
    fetch(`http://localhost:8000/api/v3/app/events/`)
    .then((data)=>{
  
          data.json().then((results)=>{
  
                  
                  let r = 2;
                  for ( ;r<results.data.length/this.state.limitEntered ; r++){
                        rowsPage.push(<li className="page-item"><a class="page-link" onClick={this.pageChanged}>{r}</a></li>)
                  }
  
                  if(! Number.isInteger(results.data.length/this.state.limitEntered))
                    rowsPage.push(<li className="page-item"><a class="page-link" onClick={this.pageChanged}>{r}</a></li>)

          })
  
    }).catch((e)=>alert("Could not fetch"))
  

    fetch(`http://localhost:8000/api/v3/app/events/?` + new URLSearchParams({
      limit: this.state.limitEntered,
      page: this.state.pageSelected,
    }),{
          
      method: 'get',
          
    }).then((data)=>{

        data.json().then((results)=>{
            let index = 1;
            let rows = []
            results.data.forEach(element => {
                rows.push(
                    <tr className="row">
                      <td className="col">{index++}</td>
                      <td className="col">{element.ename}</td>
                    </tr>
                )
                
            });
            this.count = 1
            this.setState({
              tableJSX:
                    <table className="table table-striped">
                      
                      <tbody>
                        <tr className="row bg-info">
                            <td className="col">#</td>
                            <td className="col">Event Name</td>
                        </tr>
                        {rows}
                      </tbody>
                        
                      </table>,
              paginationJSX : 
              <div>
                <ul class="pagination">
                {rowsPage}
                </ul>
              </div>
            })
            



        })

    }).catch((e)=>alert("Could not fetch"))

  }

  limitChanged = () => {

    let limit = this.limit.current.value
    if(limit == "")
      return
    else if(limit == 0){
      limit = 5
    }
    this.count = 0
    this.setState({limitEntered : limit})
    

  }

  pageChanged = (e) => {
    this.count = 0
    this.setState({pageSelected : e.target.text-1})
    

  }


  render(){
    this.fetchEvents();
    return(
      <div className="container">
              {this.state.tableJSX}
              <div className="container d-flex">
                  <input className="form-control fs-6" ref={this.limit} id="Limit" size="5" placeholder="Limit" defaultValue="5" onChange={this.limitChanged}/>
                  {this.state.paginationJSX}
              </div>
      </div>
    )
  }
    
}


export  default EventCataloguePage;