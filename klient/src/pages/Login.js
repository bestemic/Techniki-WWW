import React, {useState, useContext} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {Container, Col, Row, Alert} from 'react-bootstrap';
import {ValidContext} from "../functions/ValidContext";

function Login() {
    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertType, setAlertType] = useState("");
    const {setValidState} = useContext(ValidContext);

    const setTimeAlert = () => {
        setShowAlert(true);
        window.setTimeout(() => {
                setShowAlert(false)
            }, 3000
        );
    };

    const initialValuesLogin = {
        username: "",
        password: "",
    };

    const initialValuesRegister = {
        username: "",
        email: "",
        password: "",
    };

    const onSubmitLogin = (data, args) => {
        axios.post("http://localhost:8080/validation/login", data).then((response) => {
            if (response.data.error) {
                setTimeAlert();
                setAlertText(response.data.error);
                setAlertType("danger");
                args.resetForm();
            } else {
                localStorage.setItem("accessToken", response.data.token);
                setValidState({
                    username: response.data.username,
                    id: response.data.id,
                    status: true
                });
                navigate("/");
            }
        });
    };

    const onSubmitRegister = (data, args) => {
        axios.post("http://localhost:8080/validation", data).then((response) => {
            if (response.data.error) {
                setTimeAlert();
                setAlertText(response.data.error);
                setAlertType("danger");
            } else {
                setTimeAlert();
                setAlertText(response.data.success);
                setAlertType("success");
            }
            args.resetForm();
        });
    };

    const validationSchemaRegister = Yup.object().shape({
        username: Yup.string().required("Nazwa jest wymagana"),
        email: Yup.string().required("Email jest wymagany").matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Zła struktura emaila"),
        password: Yup.string().min(5, "Hasło musi składać się z minimum 5 znaków").required("Hasło jest wymagane")
    });

    return (
        <Container>
            <Row id="alert" className="justify-content-md-center">
                <Col md='6'>
                    <Alert variant={alertType} show={showAlert} onClose={() => setShowAlert(false)}
                           dismissible>
                        {alertText}
                    </Alert>
                </Col>
            </Row>
            <Row id="login">
                <Col className="col-center" md='6'>
                    <h1>Logowanie</h1>
                    <Formik initialValues={initialValuesLogin} onSubmit={onSubmitLogin}>
                        <Form className="form">

                            <label>Nazwa</label>
                            <ErrorMessage name="username" component="span"/>
                            <Field autoComplete="off" className="input" name="username"/>

                            <label>Hasło</label>
                            <ErrorMessage name="password" component="span"/>
                            <Field autoComplete="off" type="password" className="input" name="password"/>

                            <button type="submit">Zaloguj</button>
                        </Form>
                    </Formik>
                </Col>
                <Col className="col-center" md='6'>
                    <h1>Rejestracja</h1>
                    <Formik initialValues={initialValuesRegister} onSubmit={onSubmitRegister}
                            validationSchema={validationSchemaRegister}>
                        <Form className="form">

                            <label>Nazwa</label>
                            <ErrorMessage name="username" component="span"/>
                            <Field autoComplete="off" className="input" name="username"/>

                            <label>Email</label>
                            <ErrorMessage name="email" component="span"/>
                            <Field autoComplete="off" className="input" name="email"/>

                            <label>Hasło</label>
                            <ErrorMessage name="password" component="span"/>
                            <Field autoComplete="off" type="password" className="input" name="password"/>

                            <button type="submit">Stwórz konto</button>
                        </Form>
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;