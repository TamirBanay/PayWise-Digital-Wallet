import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BookmarkAdd from "@mui/icons-material/BookmarkAddOutlined";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import Divider from "@mui/material/Divider";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChooseNotifications from "../notifications/ChooseNotifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import { _Vouchers, _badgeContent } from "../../services/atom";
import { useRecoilState } from "recoil";
import Badge from "@mui/material/Badge";
import ClearIcon from "@mui/icons-material/Clear";
import AlertDialogModal from "./AlertDialogModal";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Avatar from "@mui/joy/Avatar";

export default function BasicCard(props) {
  const location = useLocation();
  const { pathname } = location;
  const [openAlerts, setOpenNotifications] = useState(false);
  const [vouchers, setVouchers] = useRecoilState(_Vouchers);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  const [selectedValue, setSelectedValue] = useState("");
  const [badgeContent, setBadgeContent] = useState();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [moveToOtheApp, setMoveToOtheApp] = useState(false);
  const [googleMapsOrWaze, setGoogleMapsOrWaze] = useState(true);
  const [moveToWebPage, setMoveToWebPage] = useState(false);
  const amount = props.voucher.ammount.toString().split(".00");
  const handleNavigateGoogleMaps = () => {
    window.location.href = `https://www.google.com/maps/search/?api=1&query=${props.voucher.storeName}`;
  };
  const handleNavigateWaze = () => {
    window.location.href = `https://waze.com/ul?q=${props.voucher.storeName}`;
  };
  const handleMoveToStoreWeb = () => {
    if (props.voucher.storeName == "ZARA") {
      window.location.href = `https://www.zara.com/il/`;
    } else if (props.voucher.storeName == "ACE") {
      window.location.href = `https://www.ace.co.il/`;
    } else if (props.voucher.storeName == "א.ל.מ") {
      window.location.href = `https://www.alm.co.il/`;
    } else if (props.voucher.storeName == "American Eagle") {
      window.location.href = `https://aeo.co.il/il_he/`;
    } else if (props.voucher.storeName == "FOX") {
      window.location.href = `https://www.foxgroup.co.il/`;
    } else if (props.voucher.storeName == "BUG") {
      window.location.href = `https://www.bug.co.il/`;
    }
  };
  const handleOpenWebApp = () => {
    setMoveToWebPage(!moveToWebPage);
  };
  const handleOpenExternalApplication = () => {
    setMoveToOtheApp(!moveToOtheApp);
  };

  const handleChangeAletrBeforeDelete = () => {
    setOpenDeleteAlert(!openDeleteAlert);
  };
  useEffect(() => {
    if (props.voucher.daysBeforeAlert === 1) {
      setSelectedValue("יום לפני");
      setBadgeContent("D");
    } else if (props.voucher.daysBeforeAlert === 7) {
      setSelectedValue("שבוע לפני");
      setBadgeContent("W");
    } else if (props.voucher.daysBeforeAlert === 30) {
      setSelectedValue("חודש לפני");
      setBadgeContent("M");
    } else {
      setSelectedValue("ללא התראות");
    }
  }, [props.voucher.daysBeforeAlert]);

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const handleChangeAlert = async (event) => {
    props.getWallet();
    let newAlertDay = 0;
    if (selectedValue === "יום לפני") {
      newAlertDay = 1;
      setBadgeContent("D");
    } else if (selectedValue === "שבוע לפני") {
      newAlertDay = 7;
      setBadgeContent("W");
    } else if (selectedValue === "חודש לפני") {
      newAlertDay = 30;
      setBadgeContent("M");
    } else {
      newAlertDay = 0;
      setBadgeContent();
    }

    setOpenNotifications(!openAlerts);
    fetch(`api/change_days_before_alert/${props.vID}`, {
      method: "POST",
      body: JSON.stringify({ daysBeforeAlert: newAlertDay }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Handle the response from the API
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    props.getWallet();
  };

  const handlleRedeemdVoucher = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`api/voucher_redeemed/${props.vID}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redeemed: true,
        }),
      });

      if (response.ok) {
        // Redemption successful, update wallet
        props.getWallet();
        console.log(
          "Voucher redeemed successfully. Status: " + response.status
        );
      } else {
        // Redemption failed, log error
        console.error("Voucher redemption failed. Status: " + response.status);
      }
    } catch (error) {
      // Error occurred during the redemption process
      console.error("An error occurred during voucher redemption:", error);
    }
  };

  const handleOpenAlerts = () => {
    setOpenNotifications(!openAlerts);
  };
  return (
    <div>
      {/* if the alert page is open */}
      {openAlerts ? (
        <div
        // variant="outlined"
        // sx={{ width: 320, borderRadius: 20, direction: "rtl" }}
        >
          <Typography
            level="h2"
            fontSize="md"
            sx={{ mb: 0.5, direction: "rtl", pt: "2%" }}
          >
            {props.voucher.storeName}
          </Typography>
          <Typography level="body2" sx={{ pb: "2%", direction: "rtl" }}>
            בתוקף עד: {props.voucher.dateOfExpiry.slice(0, 10)}
          </Typography>
          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            sx={{
              position: "absolute",
              top: "0.5rem",
              width: "10%",
              right: "88%",
            }}
          >
            <DeleteForeverIcon onClick={handleChangeAletrBeforeDelete} />
            {openDeleteAlert ? (
              <AlertDialogModal
                function={props.delete}
                mainText={"האם למחוק את זיכוי?"}
                title={"מחיקת זיכוי"}
                variant="plain"
                textButton={"מחק"}
                openDeleteAlert={openDeleteAlert}
                setOpenDeleteAlert={setOpenDeleteAlert}
                isOpen={openDeleteAlert}
              />
            ) : (
              ""
            )}
          </IconButton>

          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            sx={{
              position: "absolute",
              top: "0.5rem",
              width: "10%",
              right: "65%",
            }}
          >
            <LocationOnIcon onClick={handleOpenExternalApplication} />
            {moveToOtheApp ? (
              <AlertDialogModal
                function={
                  googleMapsOrWaze
                    ? handleNavigateGoogleMaps
                    : handleNavigateWaze
                }
                mainText={
                  googleMapsOrWaze
                    ? "לחיצה על google Maps תנתק אותך מאפליקציית - PayWise"
                    : "לחיצה על Waze תנתק אותך מאפליקציית - PayWise"
                }
                title={"נווט ל - " + props.voucher.storeName}
                variant="plain"
                textButton={googleMapsOrWaze ? "google Maps" : "Wase"}
                isOpen={true}
                setOpenDeleteAlert={setMoveToOtheApp}
                openDeleteAlert={moveToOtheApp}
                titleIcon={"navigate"}
                googleMapsOrWaze={googleMapsOrWaze}
                setGoogleMapsOrWaze={setGoogleMapsOrWaze}
              />
            ) : (
              ""
            )}
          </IconButton>
          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            sx={{
              position: "absolute",
              top: "0.5rem",
              width: "10%",
              right: "77%",
            }}
          >
            {/* if the daysBeforeAlert == 0 show not notifications icon, else show notification icon whit badge*/}
            {selectedValue == "ללא התראות" ? (
              <NotificationsOffIcon onClick={handleOpenAlerts} />
            ) : (
              <Badge badgeContent={badgeContent} color="primary">
                <NotificationsIcon onClick={handleOpenAlerts} />
              </Badge>
            )}
          </IconButton>

          <ChooseNotifications
            handleChange={handleChange}
            setSelectedValue={setSelectedValue}
            selectedValue={selectedValue}
          />
          <Box sx={{ display: "flex", direction: "rtl" }}>
            <div>
              <Typography
                fontSize="md"
                fontWeight="lg"
                sx={{ direction: "rtl" }}
              >
                {"  "}
                <Typography
                  fontSize="md"
                  fontWeight="lg"
                  sx={{ direction: "rtl", ml: "20%" }}
                >
                  {amount} ₪
                </Typography>
              </Typography>

              <Typography fontSize="sm" fontWeight="sm">
                מס' שובר: {props.vID}
              </Typography>
            </div>
            {/* if im in wallet page and the voucher is redeemed show v icon  or if the voucher expiry show X icon*/}
            {location.pathname == "/wallet" &&
            props.voucher.redeemed == true ? (
              <Typography sx={{ mr: "auto" }}>
                <DoneIcon color="success" fontSize="large" />
              </Typography>
            ) : currentDate > new Date(props.voucher.dateOfExpiry) &&
              props.voucher.redeemed == false ? (
              <Typography sx={{ mr: "auto", mt: "auto" }}>
                <ClearIcon color="error" fontSize="large" />
              </Typography>
            ) : (
              <Button
                variant="solid"
                size="lg"
                color="primary"
                aria-label="Explore Bahamas Islands"
                sx={{ mr: "auto", fontWeight: 500, borderRadius: "25px" }}
                onClick={handleChangeAlert}
              >
                הגדר
              </Button>
            )}
          </Box>
        </div>
      ) : (
        /* /////////////////////////////////////////////////// */
        <div>
          <Avatar
            // variant="square"
            size="lg"
            sx={{
              left: "80%",
              top: "9%",
              position: "absolute",
              boxShadow: "0.5px 0.5px 3px 0px  ",
              "& .MuiAvatar-img	": {
                // height: "90%",
              },
            }}
            onClick={handleOpenWebApp}
            src={props.img}
          />
          {moveToWebPage ? (
            <AlertDialogModal
              function={handleMoveToStoreWeb}
              mainText={"עבור לעמוד הבית של " + props.voucher.storeName}
              title={"התנתקות מ - payWise"}
              variant="plain"
              textButton={"עבור"}
              isOpen={moveToWebPage}
              openDeleteAlert={moveToWebPage}
              setOpenDeleteAlert={setMoveToWebPage}
              titleIcon={"web"}
            />
          ) : (
            ""
          )}
          <Typography
            level="h4"
            sx={{
              mt: "8%",
              ml: "1%",
              textAlign: "right",
              width: "70%",
              position: "absolute",
            }}
          >
            {props.voucher.storeName}
          </Typography>
          <Typography
            level="body2"
            fontSize="sm"
            // fontWeight="sm"
            sx={{
              width: "20%",
              position: "fixed",
              mt: "8%",
              ml: "3%",
              "&.MuiTypography-body2	": {
                fontSize: "24px",
                color: "#000",
              },
            }}
          >
            ₪{amount}
          </Typography>
          <Typography
            fontSize="md"
            fontWeight="sm"
            level="body2"
            sx={{
              width: "50%",
              position: "fixed",
              mt: "17%",
              ml: "21%",
              textAlign: "right",
            }}
          >
            {" "}
            בתוקף עד: {props.voucher.dateOfExpiry.slice(0, 10)}
          </Typography>

          <Typography
            level="body2"
            fontSize="md"
            fontWeight="sm"
            sx={{
              mt: "22%",
              ml: "21%",
              textAlign: "right",
              width: "50%",
              position: "absolute",
            }}
          >
            מס' שובר: {props.vID}
          </Typography>
          <Divider
            sx={{
              width: "100%",
              // height: "2px",
              border: "solid 0.5px",
              position: "fixed",
              mt: "33%",
              ml: "-4%",
            }}
            variant="fullWidth"
          />
          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            sx={{
              position: "absolute",
              top: "64%",
              width: "30%",
              left: "67%",
            }}
          >
            מחיקת זיכוי&nbsp;&nbsp;
            <DeleteForeverIcon onClick={handleChangeAletrBeforeDelete} />
            {openDeleteAlert ? (
              <AlertDialogModal
                function={props.delete}
                mainText={"האם למחוק את זיכוי?"}
                title={"מחיקת זיכוי"}
                variant="plain"
                textButton={"מחק"}
                isOpen={openDeleteAlert}
                openDeleteAlert={openDeleteAlert}
                setOpenDeleteAlert={setOpenDeleteAlert}
              />
            ) : (
              ""
            )}
          </IconButton>
          <IconButton
            variant="plain"
            color="neutral"
            size="md"
            sx={{
              position: "absolute",
              top: "40%",
              left: "79%",
            }}
          >
            נווט&nbsp;&nbsp;
            <LocationOnIcon onClick={handleOpenExternalApplication} />
            {moveToOtheApp ? (
              <AlertDialogModal
                function={
                  googleMapsOrWaze
                    ? handleNavigateGoogleMaps
                    : handleNavigateWaze
                }
                mainText={
                  googleMapsOrWaze
                    ? "לחיצה על google Maps תנתק אותך מאפליקציית - PayWise"
                    : "לחיצה על Waze תנתק אותך מאפליקציית - PayWise"
                }
                title={"נווט ל - " + props.voucher.storeName}
                variant="plain"
                textButton={googleMapsOrWaze ? "google Maps" : "Waze"}
                isOpen={true}
                setOpenDeleteAlert={setMoveToOtheApp}
                openDeleteAlert={moveToOtheApp}
                titleIcon={"navigate"}
                googleMapsOrWaze={googleMapsOrWaze}
                setGoogleMapsOrWaze={setGoogleMapsOrWaze}
              />
            ) : (
              ""
            )}
          </IconButton>
          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            sx={{
              position: "absolute",
              top: "52%",
              // width: "10%",
              left: "62%",
            }}
          >
            הגדרת התראות &nbsp;
            {selectedValue == "ללא התראות" ? (
              <NotificationsOffIcon onClick={handleOpenAlerts} />
            ) : (
              <Badge badgeContent={badgeContent} color="primary">
                <NotificationsIcon onClick={handleOpenAlerts} />
              </Badge>
            )}
          </IconButton>
          <Box sx={{ display: "flex", borderRadius: 10 }}>
            <div></div>
            {/* if im in wallet page and the voucher is redeemed show v icon or if the voucher expiry show X*/}
            {location.pathname == "/wallet" &&
            props.voucher.redeemed == true ? (
              <Button
                variant="contained"
                disabled
                size="sm"
                color="#B3B3B3"
                aria-label="Explore Bahamas Islands"
                sx={{
                  height: "50px",
                  mt: "80%",
                  width: "90%",
                  fontWeight: 600,
                  fontSize: "16px",
                  ml: "5%",
                  bgcolor: "#E6E6E6",
                }}
                onClick={handlleRedeemdVoucher}
              >
                מימוש
              </Button>
            ) : currentDate > new Date(props.voucher.dateOfExpiry) &&
              props.voucher.redeemed == false ? (
              <Button
                variant="contained"
                disabled
                size="sm"
                color="#B3B3B3"
                aria-label="Explore Bahamas Islands"
                sx={{
                  height: "50px",
                  mt: "80%",
                  width: "90%",
                  fontWeight: 600,
                  fontSize: "16px",
                  ml: "5%",
                  bgcolor: "#E6E6E6",
                }}
                onClick={handlleRedeemdVoucher}
              >
                מימוש
              </Button>
            ) : (
              <Button
                variant="solid"
                size="sm"
                color="primary"
                aria-label="Explore Bahamas Islands"
                sx={{
                  height: "50px",
                  mt: "80%",
                  width: "90%",
                  fontWeight: 600,
                  fontSize: "16px",
                  ml: "5%",
                }}
                onClick={handlleRedeemdVoucher}
              >
                מימוש
              </Button>
            )}
          </Box>
        </div>
      )}
    </div>
  );
}
