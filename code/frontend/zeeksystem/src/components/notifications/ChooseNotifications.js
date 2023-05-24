import { useState } from "react";
import { Box, Typography, List, ListItem, Checkbox } from "@mui/material";

function CheckboxGroup(props) {
  return (
    <Box>
      <Typography id="sandwich-group" level="body2" fontWeight="lg" mb={1}>
        בחר מתי להתחיל לקבל התראות יומיות
      </Typography>
      <Box role="group" aria-labelledby="sandwich-group">
        <List size="sm">
          <ListItem sx={{ mt: -2 }}>
            <Checkbox
              label="חודש לפני"
              checked={props.selectedValue === "חודש לפני"}
              onChange={() => props.handleChange("חודש לפני")}
            />
            חודש לפני
          </ListItem>
          <ListItem sx={{ mt: -2 }}>
            <Checkbox
              label="שבוע לפני"
              checked={props.selectedValue === "שבוע לפני"}
              onChange={() => props.handleChange("שבוע לפני")}
            />
            שבוע לפני
          </ListItem>
          <ListItem sx={{ mt: -2 }}>
            <Checkbox
              label="יום לפני"
              checked={props.selectedValue === "יום לפני"}
              onChange={() => props.handleChange("יום לפני")}
            />
            יום לפני
          </ListItem>
          <ListItem sx={{ mt: -2 }}>
            <Checkbox
              label="ללא התראות"
              checked={props.selectedValue === "ללא התראות"}
              onChange={() => props.handleChange("ללא התראות")}
            />
            ללא התראות
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}

export default CheckboxGroup;
