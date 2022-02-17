import React, {useContext, useEffect, useState} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {ValidContext} from "../functions/ValidContext";
import DatePicker from "react-datepicker"
import {Col, Container, Row} from "react-bootstrap";


function CreateTask() {
    const initialValues = {
        title: "",
        info: "",
        details: "",
    };

    const [deadline, setDeadline] = useState(new Date());
    const navigate = useNavigate();
    const {validState} = useContext(ValidContext);

    // Sprawdzenie czy ktoś jest "zalogowany"
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
    }, [navigate]);

    // Sprawdzenie czy zalogowana osoba jest autoryzowana
    useEffect(() => {
        axios.get("http://localhost:8080/validation/valid", {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            if (response.data.error) {
                navigate('/');
            }
        });
    }, [validState, navigate]);

    const onSubmitCreate = (data) => {
        data.deadline = deadline;
        axios.post("http://localhost:8080/tasks", data, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            navigate('/');
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
                    <Formik initialValues={initialValues} onSubmit={onSubmitCreate} validationSchema={validationSchema}>
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
                                                selected={deadline} dateFormat="Pp"
                                                onChange={setDeadline} showTimeSelect/>
                                </Col>
                            </Row>

                            <button type="submit">Stwórz zadanie</button>
                        </Form>
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
}

export default CreateTask;