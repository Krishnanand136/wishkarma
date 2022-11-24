import "bootstrap/dist/css/bootstrap.min.css";
import logo from '../logo.svg';
import UserEventPage from "./userEvents";
import EventCataloguePage from "./eventCatalogue";
import CreateEventPage from "./createEvent";
import React , {useState} from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';



function MyBody(){

    const [userId , setUserId] = useState("637c23b45eed1f9365dd8a3b")
    const [show, setShow] = useState(false);
    const [changed , setChanged] = useState(false);

    const createEventPageJSX = <CreateEventPage pageUpdater={setPage} uid = {userId}/>;
    const userEventPageJSX = <UserEventPage pageUpdater={setPage} uid = {userId}/>;
    const EventCataloguePageJSX = <EventCataloguePage pageUpdater={setPage}/>;

    
    const [pageDisplayed , setPageDisplayed] = useState(EventCataloguePageJSX);
    
    const closeSideBar = () => setShow(false);
    const showSideBar = () => setShow(true);

    function setPage(pageName){
        if(pageName == "UserEvents"){
          setPageDisplayed(userEventPageJSX)
        }else if(pageName == "CreateEvent"){
          setPageDisplayed(createEventPageJSX)
        }else{
          setPageDisplayed(EventCataloguePageJSX)
        }
        closeSideBar();
    }

    return(
      <div>
        <nav className="navbar bg-dark d-flex">
        <div className="container-fluid">
          <div className="navbar-brand d-flex">
            <a onClick={showSideBar}>
              <img src={logo} alt="Logo" width="60" height="48" className="d-inline-block align-text-top"/>
            </a> 
            <h1 className="text-light text-opacity-75">Events</h1>
          </div>
        </div>
        
        <Offcanvas show={show} onHide={closeSideBar}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="fs-2">Krishnanand Shenoy</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
              <button className="btn fs-3 bg-secondary w-100 mt-1" onClick={(e)=>setPage("UserEvents")}>Your Events</button>
              <button className="btn fs-3 bg-secondary w-100 mt-1" onClick={(e)=>setPage("CreateEvent")}>Create New Event</button>
              <button className="btn fs-3 bg-secondary w-100 mt-1" onClick={(e)=>setPage("EventCatalogue")}>Event Catalogue</button>
          </Offcanvas.Body>
        </Offcanvas>
        </nav>
        {pageDisplayed}
      </div>
  )

}


export {MyBody};