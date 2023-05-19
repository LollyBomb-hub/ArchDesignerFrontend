import React from "react";
import {IRootState} from "../../store/store";
import {connect, ConnectedProps} from "react-redux";
import {Alert, AlertTitle, Box, Button, Modal, TextField, Typography} from "@mui/material";
import {createProject, isCreatingProject, resetCreatingProject} from "../../store/reducers/projectReducer";
import {Formik} from "formik";
import {ProjectInfoCreate} from "../../server/interfaces";
import * as Yup from 'yup';
import Grid2 from "@mui/material/Unstable_Grid2";


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};


interface IProps extends ReduxProps {
}

const mapStateToProps = (state: IRootState) => {
    let {projectCreatingState, projectCreatingError, creatingProject} = state.projectSlice;
    return {projectCreatingState, projectCreatingError, creatingProject}
}

const mapDispatchToProps = {createProject, isCreatingProject, resetCreatingProject}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

const validationSchema = Yup.object().shape(
    {
        project_name: Yup.string().required("Укажите название проекта").min(1, "Минимум 1 символ в названии"),
        project_description: Yup.string()
    }
)

export default connector((props: IProps) => {
    if (props.projectCreatingState === 'ERRORED') {
        return (
            <>
                <Alert onClose={()=>{props.resetCreatingProject()}} severity="error">
                    <AlertTitle>
                        Ошибка
                    </AlertTitle>
                    Не вышло создать проект
                </Alert>
            </>
        )
    }
    if (props.projectCreatingState === 'DONE') {
        return (
            <>
                <Alert onClose={()=>{props.resetCreatingProject()}} severity="success">
                    <AlertTitle>Успешно</AlertTitle>
                    Проект создан
                </Alert>
            </>
        )
    }
    return (
        <>
            <Modal aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"
                   open={props.creatingProject} onClose={() => props.isCreatingProject(false)}>
                <Box sx={style}>
                    <div id="modal-modal-title">
                        <Typography variant="h6" component="h2">
                            Форма создания проекта
                        </Typography>
                    </div>
                    <div id="modal-modal-description">
                        <Formik initialValues={{
                            project_name: '',
                            project_description: undefined
                        } as ProjectInfoCreate}
                                onSubmit={values => {
                                    props.createProject(values);
                                }}
                                validationSchema={validationSchema}>
                            {
                                ({
                                     values,
                                     errors,
                                     touched,
                                     handleChange,
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
                                                       id={"project-name-field"}
                                                       name="project_name"
                                                       variant={"outlined"}
                                                       label={"Введите название проекта"}
                                                       required
                                                       placeholder={"Название проекта"}
                                                       value={values.project_name}
                                                       onChange={handleChange}
                                                       error={Boolean(errors.project_name)}
                                                       helperText={errors.project_name}/>
                                            <TextField name="project_description"
                                                       value={values.project_description}
                                                       style={{marginLeft: 0, marginRight: 0}}
                                                       id={"project-description-field"}
                                                       variant={"outlined"}
                                                       multiline
                                                       label={"Введите описание проекта"}
                                                       placeholder={"Описание проекта"}
                                                       error={(errors.project_description !== undefined)}
                                                       helperText={
                                                           errors.project_description ? <>{errors.project_description}</> : <></>
                                                       }
                                                       onChange={handleChange}/>
                                            <Grid2 container direction={"row-reverse"}>
                                                <Button
                                                    disabled={Boolean(errors.project_name) || (values.project_name === '') || props.projectCreatingState !== undefined}
                                                    type={"submit"} style={{marginTop: 2, width: "max-content"}}
                                                    variant={"contained"}
                                                    color={"success"}>Создать</Button>
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