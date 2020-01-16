import React from "react";
import styled from "styled-components";
import {
  TextField as MuiTextField,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";


const TextFieldSpacing = styled(MuiTextField)(spacing);

const TextField = styled(TextFieldSpacing)`
  width: 200px;
  padding: 5px 5px;
`;
function EditText(field){
  return (<TextField
    label={field.field_name}
    variant="outlined"
    value={field.field_value}
    size="small"
    margin='dense'
    InputProps={{
        classes: {
          input: {
            fontSize: 13,
          },
        }
    }}
  />)
}

  
export default EditText;
