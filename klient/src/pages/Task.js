import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {ValidContext} from "../functions/ValidContext";
import {Col, Row, Container} from "react-bootstrap";
import dayjs from "dayjs";


function Task() {
    const [task, setTask] = useState({});
    const navigate = useNavigate();
    const {validState} = useContext(ValidContext);
    let {id} = useParams();

    //Pobranie informacji o zadaniu
    const getTaskData = (username) => {
        axios.get(`http://localhost:8080/tasks/byID/${id}`).then((response) => {
            if (response.data) {
                if (username === response.data.username && response.data.ended === false) {
                    setTask(response.data);
                } else {
                    navigate("/");
                }
            } else {
                navigate("/");
            }
        });
    }

    // Sprawdzenie czy zalogowana osoba jest autoryzowana
    useEffect(() => {
        axios.get("http://localhost:8080/validation/valid", {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            if (response.data.error) {
                navigate('/');
            } else {
                getTaskData(response.data.username);
            }
        });
    }, [validState, navigate]);

    const endTask = () => {
        axios.patch(`http://localhost:8080/tasks/end/${id}`, {}, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            navigate("/");
        });
    }

    const editTask = () => {
        navigate(`/edit/${id}`);
    }

    const isOver = (deadline) => {
        if (dayjs(deadline).isBefore(dayjs())) {
            return " over";
        } else {
            return "";
        }
    }

    return (
        <Container>
            <Container className="parent-info">
                <Container className="info">
                    <Row>
                        <Col className="task-col">
                            <Row className="title">
                                <div>Tytuł</div>
                            </Row>
                            <Row className="text">
                                <div>{task.title}</div>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="task-col" md='4'>
                            <Row className="title">
                                <div>Krótki opis</div>
                            </Row>
                            <Row className="text">
                                <div>{task.info}</div>
                            </Row>
                        </Col>
                        <Col className="task-col" md='4'>
                            <Row className="title" id="b1">
                                <div>Data wykonania</div>
                            </Row>
                            <Row className={'text' + isOver(task.deadline)} id="b2">
                                <div>{dayjs(task.deadline).format("DD/MM/YYYY HH:mm")}</div>
                            </Row>
                        </Col>
                        <Col className="task-col" md='4'>
                            <Row className="title" id="b3">
                                <div>Autor</div>
                            </Row>
                            <Row className="text" id="b4">
                                <div>{task.username}</div>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="task-col">
                            <Row className="title">
                                <div>Szczegóły</div>
                            </Row>
                            <Row className="text">
                                <div id="details">{task.details}</div>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="task-button" md='6'>
                            <button onClick={editTask}>Edytuj</button>
                        </Col>
                        <Col className="task-button" md='6'>
                            <button onClick={endTask}>Zakończ</button>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </Container>
    );
}

export default Task;