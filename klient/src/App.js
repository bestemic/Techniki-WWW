import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import Home from "./pages/Home";
import CreateTask from "./pages/CreateTask";
import Task from "./pages/Task";
import Login from "./pages/Login";
import User from "./pages/User";
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import {ValidContext} from "./functions/ValidContext";
import React, {useEffect, useState} from "react";
import axios from "axios";
import EditTask from "./pages/EditTask";
import {Container, Nav, Navbar, Button} from "react-bootstrap";

function App() {
    const [validState, setValidState] = useState({
        username: "",
        id: 0,
        status: false
    });
    const [expanded, setExpanded] = useState(false);

    // Sprawdzenie czy zalogowana osoba jest autoryzowana
    useEffect(() => {
        axios.get("http://localhost:8080/validation/valid", {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            if (response.data.error) {
                setValidState({...validState, status: false});
            } else {
                setValidState({
                    username: response.data.username,
                    id: response.data.id,
                    status: true
                });
            }
        });
    }, []);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setValidState({
            username: "",
            id: 0,
            status: false
        });
        setExpanded(false);
    }

    return (
        <Router>
            <Navbar expanded={expanded} bg="dark" variant={"dark"} expand="md">
                <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="navbarScroll"/>
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                        {!validState.status ? (
                            <>
                                <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/login">Logowanie i Rejestracja</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/">Strona główna</Nav.Link>
                                <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/create">Dodaj zadanie</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {validState.status && (
                            <>
                                <Nav.Link onClick={() => setExpanded(false)} as={Link}
                                          to={`/user/${validState.id}`}>{validState.username}</Nav.Link>
                                <Button variant="secondary" onClick={logout}>Wyloguj</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>


            <div className="App">
                <ValidContext.Provider value={{validState, setValidState}}>

                        <Routes>
                            <Route exact path="/" element={<Home/>}/>
                            <Route exact path="/create" element={<CreateTask/>}/>
                            <Route exact path="/task/:id" element={<Task/>}/>
                            <Route exact path="/login" element={<Login/>}/>
                            <Route exact path="/user/:id" element={<User/>}/>
                            <Route exact path="/edit/:id" element={<EditTask/>}/>
                        </Routes>

                </ValidContext.Provider>
            </div>
        </Router>
    );
}

export default App;
