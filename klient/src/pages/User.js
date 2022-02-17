import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {ValidContext} from "../functions/ValidContext";
import {Col, Container, Row} from "react-bootstrap";
import dayjs from "dayjs";


function User() {
    const [userInfo, setUserInfo] = useState({});
    const [listOfTasks, setListOfTasks] = useState([]);
    const navigate = useNavigate();
    const {setValidState} = useContext(ValidContext);
    const {validState} = useContext(ValidContext);
    let {id} = useParams();

    //Pobranie zadań
    const getTasks = (username) => {
        axios.get(`http://localhost:8080/tasks/ended/${username}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            setListOfTasks(response.data);
        });
    };

    //Pobranie informacji o użytkowniku
    const getUserData = (username) => {
        axios.get(`http://localhost:8080/validation/${id}`).then((response) => {
            if (response.data) {
                if (username === response.data.username) {
                    setUserInfo(response.data);
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
                getUserData(response.data.username);
                getTasks(response.data.username)
            }
        });
    }, [validState, navigate]);

    const delateUser = () => {
        axios.delete(`http://localhost:8080/validation/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            localStorage.removeItem("accessToken");
            setValidState({
                username: "",
                id: 0,
                status: false
            });
            navigate("/");
        });
    }

    return (
        <Container className="user">
            <Container className="parent-info">
                <Container className="info">
                    <Row>
                        <Col className="task-col">
                            <Row className="title">
                                <div>Nazwa</div>
                            </Row>
                            <Row className="text">
                                <div>{userInfo.username}</div>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="task-col">
                            <Row className="title">
                                <div>Email</div>
                            </Row>
                            <Row className="text">
                                <div id="details">{userInfo.email}</div>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="task-button">
                            <button onClick={delateUser}>Usuń konto</button>
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container className="home-info">
                <h1 className="informations">Zakończone zadania</h1>
                {listOfTasks.length === 0 ? (
                    <h3 className="informations">Brak zakończonych zadań</h3>
                ) : (
                    listOfTasks.map((value, index) => {
                        return (
                            <Container className="tasks" key={value.id}>
                                <Row>
                                    <Col className="task" md='4' id="hb1">
                                        {value.title}
                                    </Col>
                                    <Col className="task" md='4' id="hb2">
                                        {value.info}
                                    </Col>
                                    <Col className="task" md='4' id="hb3">
                                        {dayjs(value.deadline).format("DD/MM/YYYY HH:mm")}
                                    </Col>
                                </Row>
                            </Container>
                        );
                    })
                )}
            </Container>
        </Container>


    );
}

export default User;