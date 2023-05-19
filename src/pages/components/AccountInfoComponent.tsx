import React from "react";
import PortraitIcon from '@mui/icons-material/Portrait';
import DescriptionIcon from '@mui/icons-material/Description';
import {Box, Button, Divider, Skeleton, Stack, Typography} from "@mui/material";
import {loadAccountInfo, unlogin} from "../../store/reducers/accountReducer";
import {formatTimestampForLocale} from "../../server/interfaces";
import {AccountCircle, EventAvailable, Star} from "@mui/icons-material";
import {connect, ConnectedProps} from "react-redux";
import {IRootState} from "../../store/store";

interface IProps extends ReduxProps {
}

class AccountInfoComponent extends React.Component<IProps, never> {

    componentDidMount() {
        if (this.props.accountInfoRead === undefined && this.props.loadingState !== 'PENDING') {
            this.props.loadAccountInfo()
        }
    }

    render() {
        if (this.props.loadingState === 'PENDING') {
            return (
                <Box minWidth={"300px"} width={"400px"} maxWidth={"400px"} padding={1.5}>
                    <Stack marginBottom={2} direction="row" fontSize={30} alignItems={"center"} gap={1}>
                        <AccountCircle htmlColor="#c8f7ff" style={{fontSize: 50}} fontSize={"inherit"}/>
                        <Skeleton width={"100%"}/>
                    </Stack>
                    <Divider/>
                    <Stack marginTop={2} marginBottom={2} direction="row" alignItems={"center"} gap={1}>
                        <PortraitIcon/>
                        <Skeleton width={"100%"}/>
                    </Stack>
                    <Stack marginTop={2} marginBottom={2} direction="row" alignItems={"center"} gap={1}>
                        <EventAvailable/>
                        <Skeleton width={"100%"}/>
                    </Stack>
                    <Stack marginBottom={2} direction="row" alignItems={"center"} gap={1}>
                        <Star htmlColor="#ffe037"/>
                        <Skeleton width={"100%"}/>
                    </Stack>
                    <Stack direction="row" alignItems={"center"} gap={1}>
                        <DescriptionIcon/>
                        О себе:
                    </Stack>
                    <Typography paddingLeft={1} marginBottom={2} color={"text.secondary"}>
                        <Skeleton width={"100%"}/>
                    </Typography>
                </Box>
            )
        }
        return (
            <Box minWidth={"300px"} width={"400px"} maxWidth={"400px"} padding={1.5}>
                <Stack marginBottom={2} direction="row" fontSize={30} alignItems={"center"} gap={1}>
                    <AccountCircle htmlColor="#c8f7ff" style={{fontSize: 50}} fontSize={"inherit"}/>
                    <Typography color={"text.primary"}>О пользователе</Typography>
                </Stack>
                <Divider/>
                <Stack marginTop={2} marginBottom={2} direction="row" alignItems={"center"} gap={1}>
                    <PortraitIcon/>
                    Имя: {this.props.accountInfoRead?.name}
                </Stack>
                <Stack marginTop={2} marginBottom={2} direction="row" alignItems={"center"} gap={1}>
                    <EventAvailable/>
                    Дата создания аккаунта: {formatTimestampForLocale(this.props.accountInfoRead?.created_at)}
                </Stack>
                <Stack marginBottom={1} direction="row" alignItems={"center"} gap={1}>
                    <Star htmlColor="#ffe037"/>
                    Звёзд: {this.props.accountInfoRead?.stars}
                </Stack>
                {this.props.accountInfoRead?.about && (<>
                    <Stack marginBottom={0.5} direction="row" alignItems={"center"} gap={1}>
                        <DescriptionIcon/>
                        О себе:
                    </Stack>
                    <Divider/>
                    <Typography marginBottom={2} color={"text.secondary"}>
                        {this.props.accountInfoRead?.about}
                    </Typography>
                </>)}
                <Button color="error" onClick={() => {
                    this.props.unlogin()
                }}>
                    Выйти
                </Button>
            </Box>
        )
    }
}


const mapStateToProps = (state: IRootState) => (
    {
        loadingState: state.accountSlice.accountLoadingState,
        errorAccountLoading: state.accountSlice.errorAccountLoading,
        accountInfoRead: state.accountSlice.accountInfoRead
    }
)

const mapDispatchToProps = {
    loadAccountInfo,
    unlogin
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(AccountInfoComponent);