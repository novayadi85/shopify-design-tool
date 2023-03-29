import { Button } from "@shopify/polaris";
import React, { useCallback, useState, useEffect } from "react";
import { CirclePlusOutlineMinor } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";
export default function AddColumn({ handle }) {

    const navigate = useNavigate();

    const toggleActive = () => {
        navigate(`/column/${handle}`);
    }

    return (
        <div className="add-column">
           <Button onClick={toggleActive} icon={CirclePlusOutlineMinor}>Add Column</Button>
        </div>
    );

}