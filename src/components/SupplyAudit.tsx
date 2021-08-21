import * as React from "react";
import SupplyRow from "./SupplyRow";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

const SupplyAudit = (props: any) => {
    const { supply } = props;

    return (
        <Card>
            <CardHeader
                title={'Bridge supply'}
                subheader={'Audit the bridge supply'}
            />

            <CardContent>
                <SupplyRow label={"Bridge supply"} value={supply.bridge} decimal={8} symbol={"WNAV"}/>
                <SupplyRow label={"Cold storage supply"} value={supply.cold} decimal={8} symbol={"WNAV"}/>
            </CardContent>
        </Card>
    );
};

export default SupplyAudit;
