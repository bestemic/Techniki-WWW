import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {ValidContext} from "../functions/ValidContext";
import {Container, Col, Row, Button} from "react-bootstrap";
import {GrClose} from "react-icons/gr"
import dayjs from "dayjs";


function Home() {
    const [listOfTasks, setListOfTasks] = useState([]);
    const navigate = useNavigate();
    const {validState} = useContext(ValidContext);

    //Pobranie zadań
    const getTasks = (username) => {
        axios.get(`http://localhost:8080/tasks/active/${username}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            setListOfTasks(response.data);
        });
    };

    // Sprawdzenie czy zalogowana osoba jest autoryzowana
    useEffect(() => {
        axios.get("http://localhost:8080/validation/valid", {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            if (response.data.error) {
                navigate('/login');
            } else {
                getTasks(response.data.username);
            }
        });
    }, [validState.status, navigate]);

    const endTask = (id) => {
        axios.patch(`http://localhost:8080/tasks/end/${id}`, {}, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            setListOfTasks(listOfTasks.filter((value) => {
                return value.id !== id;
            }));
        });
    }

    const showTask = (id) => {
        navigate(`/task/${id}`);
    };

    const isOver = (deadline)=>{
        if(dayjs(deadline).isBefore(dayjs())) {
            return " over";
        }
        else{
            return "";
        }
    }

    return (
        <Container className="home-info">
            <h1 className="informations">Zadania do wykonania</h1>
            {listOfTasks.length === 0 ? (
                <h3 className="informations">Brak zadań do wykonania</h3>
            ) : (
                listOfTasks.map((value, index) => {
                    return (
                        <Container className="tasks" key={value.id}>
                            <Row>
                                <Col className="task" md='4' id="hb1" onClick={() => showTask(value.id)}>
                                    {value.title}
                                </Col>
                                <Col className="task" md='4' id="hb2">
                                    {value.info}
                                </Col>
                                <Col className={'task' + isOver(value.deadline)} md='3' id="hb3">
                                    {dayjs(value.deadline).format("DD/MM/YYYY HH:mm")}
                                </Col>

                                <Col className="task" md='1' id="taskbutton">
                                    {value.username === validState.username &&
                                    <Button variant="secondary" size='sm' onClick={() => {
                                        endTask(value.id)
                                    }}>
                                        <GrClose/>
                                    </Button>}
                                </Col>
                            </Row>
                        </Container>
                    );
                })
            )}
        </Container>
    );
}

export default Home;