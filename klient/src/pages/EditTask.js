import React, {useContext, useEffect, useState} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {ValidContext} from "../functions/ValidContext";
import DatePicker from "react-datepicker";
import {Container, Col, Row} from "react-bootstrap";


function EditTask() {
    const [initialValues, setInitialValues] = useState({
        title: "",
        info: "",
        details: "",
    });

    const [deadline, setDeadline] = useState(new Date());
    const navigate = useNavigate();
    const {validState} = useContext(ValidContext);
    let {id} = useParams();

    //Pobranie informacji o zadaniu
    const getTaskData = (username) => {
        axios.get(`http://localhost:8080/tasks/byID/${id}`).then((response) => {
            if (response.data) {
                if (username === response.data.username) {
                    setInitialValues({
                        title: response.data.title,
                        info: response.data.info,
                        details: response.data.details,
                    });
                    setDeadline(new Date(response.data.deadline));
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

    const onSubmitEdit = (data) => {
        data.deadline = deadline;
        axios.patch(`http://localhost:8080/tasks/${id}`, data, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            navigate(`/task/${id}`);
        });
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Tytuł jest wymagany"),
        info: Yup.string().max(40, "Za długi opis").required("Krótki opis jest wymagany"),
        details: Yup.string().required("Szczegóły są wymagane")
    });

    return (
        <Container>
            <Row id="createTask">
                <Col className="col-center">
                    <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={onSubmitEdit}
                            validationSchema={validationSchema}>
                        <Form className="form">
                            <label>Tytuł zadania</label>
                            <ErrorMessage name="title" component="span"/>
                            <Field className="input" name="title"/>

                            <label>Krótki opis</label>
                            <ErrorMessage name="info" component="span"/>
                            <Field className="input" name="info"/>

                            <label>Szczegóły</label>
                            <ErrorMessage name="details" component="span"/>
                            <Field className="input" id='details' component="textarea" name="details"/>

                            <label>Data wykonania</label>
                            <Row>
                                <Col id="col-datePicker" xs='1'>
                                    <DatePicker className="input" minDate={new Date()} popperPlacement="top-end"
                                                selected={deadline} onChange={setDeadline} dateFormat={"Pp"} showTimeSelect/>
                                </Col>
                            </Row>

                            <button type="submit">Zatwierdź</button>
                        </Form>
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
}

export default EditTask;