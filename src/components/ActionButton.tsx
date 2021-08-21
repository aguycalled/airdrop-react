import styled from "@emotion/styled";
import Button from "@material-ui/core/Button";

let Btn = styled(Button)(
    {
        width: '90%',
        margin: '10px'
    }
)

export default function ActionButton (props: any) {
    return (
        <Btn onClick={props.onClick} sx={props.sx} variant={"outlined"}>{props.children}</Btn>
    )
}

