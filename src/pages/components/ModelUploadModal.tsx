import React from "react";
import {IRootState} from "../../store/store";
import {connect, ConnectedProps} from "react-redux";
import {Alert, AlertTitle, Box, Button, Modal, Snackbar, TextField, Typography} from "@mui/material";
import {isUploadingModel, resetUpload, uploadModelThunk} from "../../store/reducers/modelReducer";
import {Formik} from "formik";
import * as Yup from 'yup';
import Grid2 from "@mui/material/Unstable_Grid2";


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    width: '500px',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};


interface IProps extends ReduxProps {
}

const mapStateToProps = (state: IRootState) => {
    let {uploadError, uploadState, uploadingModel} = state.modelSlice;
    return {uploadState, uploadError, uploadingModel}
}

const mapDispatchToProps = {uploadModelThunk, isUploadingModel, resetUpload}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

const validationSchema = Yup.object().shape(
    {
        model_name: Yup.string().required("Укажите название проекта").min(1, "Минимум 1 символ в названии"),
        model_description: Yup.string().required("Для модели описание обязательно"),
        ifc_file: Yup.string().required("Файл модели обязателен")
    }
)

export default connector((props: IProps) => {
    if (props.uploadState === 'ERRORED') {
        return (
            <Snackbar open={props.uploadingModel} autoHideDuration={6000} onClose={() => {
                props.resetUpload()
            }}>
                <Alert onClose={() => {
                    props.resetUpload()
                }} severity="error">
                    <AlertTitle>
                        Ошибка
                    </AlertTitle>
                    Не вышло загрузить модель
                </Alert>
            </Snackbar>
        )
    }
    if (props.uploadState === 'DONE') {
        return (
            <Snackbar open={props.uploadingModel} autoHideDuration={6000} onClose={() => {
                props.resetUpload()
            }}>
                <Alert onClose={() => {
                    props.resetUpload()
                }} severity="success">
                    <AlertTitle>Успешно</AlertTitle>
                    Модель загружена
                </Alert>
            </Snackbar>
        )
    }
    return (
        <>
            <Modal aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"
                   open={props.uploadingModel} onClose={() => props.isUploadingModel(false)}>
                <Box component={"div"} sx={style}>
                    <div id="modal-modal-title">
                        <Typography variant="h6" component="h2">
                            Форма загрузки модели
                        </Typography>
                    </div>
                    <div id="modal-modal-description">
                        <Formik initialValues={{
                            model_name: '',
                            model_description: '' as string | undefined,
                            ifc_file: undefined as string | undefined
                        }}
                                onSubmit={values => {
                                    if (values.ifc_file) {
                                        props.uploadModelThunk(
                                            {
                                                modelInfoCreate: {
                                                    model_name: values.model_name,
                                                    model_description: values.model_description
                                                },
                                                ifcFile: values.ifc_file
                                            }
                                        )
                                    }
                                }}
                                validationSchema={validationSchema}>
                            {
                                ({
                                     values,
                                     errors,
                                     handleChange,
                                     setFieldValue,
                                     touched,
                                     handleSubmit,
                                 }) => {
                                    return <Box
                                        component="form"
                                        sx={{
                                            '& .MuiTextField-root': {m: 1, width: '25ch'},
                                        }}
                                        autoComplete="off"
                                        onSubmit={handleSubmit}
                                    >
                                        <Grid2 container direction={"column"}>
                                            <TextField style={{marginLeft: 0, marginRight: 0}}
                                                       id={"model-name-field"}
                                                       name="model_name"
                                                       variant={"outlined"}
                                                       label={"Введите название модели"}
                                                       required
                                                       placeholder={"Название модели"}
                                                       value={values.model_name}
                                                       onChange={handleChange}
                                                       error={Boolean(errors.model_name)}
                                                       helperText={errors.model_name}/>
                                            <TextField name="model_description"
                                                       value={values.model_description}
                                                       style={{marginLeft: 0, marginRight: 0}}
                                                       id={"model-description-field"}
                                                       variant={"outlined"}
                                                       multiline
                                                       required
                                                       label={"Введите описание модели"}
                                                       placeholder={"Описание модели"}
                                                       error={Boolean(errors.model_description) && Boolean(touched.model_description)}
                                                       helperText={
                                                           errors.model_description ? <>{errors.model_description}</> : <></>
                                                       }
                                                       onChange={handleChange}/>
                                            <input onChange={
                                                async (e) => {
                                                    const files = e.target.files;
                                                    if (files === null) {
                                                        return;
                                                    }
                                                    const f = files[0];
                                                    if (f === null) {
                                                        return;
                                                    }
                                                    const fr = new FileReader()
                                                    fr.onload = () => {
                                                        setFieldValue("ifc_file", fr.result, true)
                                                    }
                                                    fr.readAsText(f)
                                                }
                                            } type={"file"} accept={".ifc"} style={{marginTop: '5px'}}/>
                                            <Grid2 container direction={"row-reverse"}>
                                                <Button
                                                    disabled={Boolean(errors.model_name) || Boolean(errors.model_description) || (values.model_name === '') || (values.ifc_file === undefined) || props.uploadState !== undefined}
                                                    type={"submit"} style={{marginTop: 2, width: "max-content"}}
                                                    variant={"contained"}
                                                    color={"success"}>Загрузить</Button>
                                            </Grid2>
                                        </Grid2>
                                    </Box>
                                }
                            }
                        </Formik>
                    </div>
                </Box>
            </Modal>
        </>
    )
})