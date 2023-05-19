import React from "react";

interface IProps {
    width: number
}

export const Logo = ({width}: IProps) => {
    return (
        <img alt={"ArchDesigner"} src="/logo.svg" style={{width: width}}/>
    )
}

export const OnlyIconLogo = ({width, height}: {
    width: number,
    height: number
}) => {
    return (
        <img src={"/favicon.svg"} style={{color: "#FFFFFF", backgroundColor: "#FFFFFF", display: 'inline-block', width: `${width}px`, height: `${height}px`}}/>
    )
}