import React from "react";
import {IRootState} from "../../store/store";
import {connect, ConnectedProps} from "react-redux";
import {
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    styled,
    Theme,
    Typography
} from "@mui/material";
import MuiLink from "@mui/material/Link"
import MuiDrawer from '@mui/material/Drawer';
import {AccountTree, Add, HouseSiding, Remove, Speed, Stairs} from "@mui/icons-material";
import {Link} from "react-router-dom";

import './toolbar.css'
import {Logo, OnlyIconLogo} from "./Logo";
import {CSSObject} from "@emotion/react";

interface IProps extends ReduxProps {
    open: boolean
    onToolbarClick: () => void
    currentMenuItem: number
    selectMenuItem: (selectedMenuItem: number) => void
}

interface IState {
}

interface ToolbarItem {
    icon: React.ReactNode
    text: string
    linkTo: string,
}

const items: ToolbarItem[] = [
    {
        icon: <Speed fontSize="inherit"/>,
        text: "Главная",
        linkTo: "/"
    },
    {
        icon: <AccountTree fontSize="inherit"/>,
        text: "Проекты",
        linkTo: "/projects"
    },
    {
        icon: <HouseSiding fontSize={"inherit"}/>,
        text: "BIM-Модели",
        linkTo: "/models"
    },
    {
        icon: <Stairs fontSize={"inherit"}/>,
        text: "Этажи",
        linkTo: "/stages"
    }
]

const drawerWidth = 240;
const closedDrawerWidth = 54;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    borderRight: 0
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    width: `${closedDrawerWidth}px`,
    overflowX: "hidden",
    borderRight: 0
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(0, 0),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        backgroundColor: theme.palette.primary.dark,
        width: open ? drawerWidth : closedDrawerWidth,
        whiteSpace: 'nowrap',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

class ActionToolbar extends React.Component<IProps, IState> {
    render() {
        let {open} = this.props;
        let currentDrawerWidth = open ? drawerWidth : closedDrawerWidth;
        return (
            <Drawer className={"toolbar-drawer"} variant={"permanent"} anchor="left" open={open}>
                <DrawerHeader>
                    <Stack bgcolor={"primary.main"} height={"70px"} direction="column" justifyContent="center"
                           alignItems="center">
                        {
                            open ? (<Typography color={"contrast.main"} fontSize={"30px"}>
                                <Logo width={200}/>
                            </Typography>) : (<OnlyIconLogo width={54} height={70}/>)
                        }
                    </Stack>
                </DrawerHeader>
                <List sx={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1
                    }
                }>
                    {
                        items.map(
                            el => {
                                const currentMenuItem = items.indexOf(el);
                                let selected = this.props.currentMenuItem === currentMenuItem;
                                return (
                                    <Link key={el.text} to={el.linkTo}>
                                        <MuiLink component={"div"} color={"contrast.main"} onClick={(e) => {
                                            this.props.selectMenuItem(currentMenuItem);
                                        }}>
                                            <ListItem disablePadding style={{fontSize: "18px"}}>
                                                <ListItemButton style={
                                                    {
                                                        backgroundColor: selected ? "#E9587F" : "inherit"
                                                    }
                                                }>
                                                    <ListItemIcon color={"inherit"}
                                                                  style={{color: "#FFFFFF", fontSize: "22px"}}>
                                                        {el.icon}
                                                    </ListItemIcon>
                                                    <ListItemText primary={el.text}/>
                                                </ListItemButton>
                                            </ListItem>
                                        </MuiLink>
                                    </Link>
                                )
                            }
                        )
                    }
                </List>
                <Button sx={
                    {
                        height: "60px",
                        maxWidth: `${currentDrawerWidth}px`,
                        minWidth: `${currentDrawerWidth}px`,
                        width: `${currentDrawerWidth}px`
                    }
                } onClick={() => {
                    this.props.onToolbarClick()
                }} variant={"contained"} color="primary"
                        aria-label="add">
                    {open ? <Remove style={
                        {
                            width: "24px",
                        }
                    }/> : <Add style={
                        {
                            width: "24px",
                        }
                    }/>}
                </Button>
            </Drawer>
        )
    }
}

const mapStateToProps = (state: IRootState) => ({})

const mapDispatchToProps = {}

const connector = connect(mapStateToProps, mapDispatchToProps)
type ReduxProps = ConnectedProps<typeof connector>

export default connector(ActionToolbar);