import React, { useState, useEffect } from "react";
import {
  Input,
  Title,
  Label,
  CheckBox,
  Button,
  MessageStrip,
  ComboBoxItem,
  ComboBox,
} from "@ui5/webcomponents-react";
import axios from "axios";
import Config from "../Config";

const MAX_RESPONSES_PER_ELECTIVE = 50;

export default function ElectiveForm() {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    mobileNumber: "",
    class: "",
  });

  const [message, setMessage] = useState("");
  const [classList, setClassList] = useState([]);
  const [electivesList, setElectivesList] = useState([]);
  const [selectedElectives, setSelectedElectives] = useState([]);
  const [responseCounts, setResponseCounts] = useState([]);
  const [isActiveCheckBox, setIsActiveCheckBox] = useState(false);
  const [disabledElectives, setDisabledElectives] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await axios.get(Config.GET_CLASS_LIST);
        const electivesRes = await axios.get(Config.GET_ELECTIVE_LIST);
        setClassList(classRes.data);
        setElectivesList(electivesRes.data);
        setResponseCounts(new Array(electivesRes.data.length).fill(0));
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  const handleInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCheckboxChange = async (index, checked, text) => {
    const updated = [...selectedElectives];

    if (checked) {
      try {
        const response = await axios.get(
          Config.CHECK_ELECTIVE_OPTION + `/${text}`
        );
        const data = response.data;

        if (data.isDisabled) {
          setMessage(data.message);
          setDisabledElectives((prev) => ({ ...prev, [text]: true }));

          return;
        }

        if (!updated.includes(index)) {
          updated.push(index);
          setSelectedElectives(updated);
        }
      } catch (err) {
        console.error("Error checking elective option:", err);
      }
    } else {
      const idx = updated.indexOf(index);
      if (idx > -1) {
        updated.splice(idx, 1);
      }
      setSelectedElectives(updated);
    }
  };

  const createUserData = async (data) => {
    try {
      console.log("updateData data", data);
      let url = Config.CREATE_USER;
      const response = await axios.post(url, data);
      if (response.data) {
        setSelectedElectives([]);
        setFormData({ name: "", rollNumber: "", mobileNumber: "", class: "" });
        setMessage(
          `Successfully submitted. You selected: ${data.answer.join(", ")}`
        );
      } else {
        console.log("Failed to updateData");
      }
    } catch (error) {
      console.log("updateData error:::", error);
    }
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.rollNumber ||
      !formData.mobileNumber ||
      !formData.class
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const updatedCounts = [...responseCounts];
    const selectedNames = [];

    selectedElectives.forEach((index) => {
      selectedNames.push(electivesList[index].ELECTIVENAME);
    });
    let data = {
      name: formData.name,
      rollNumber: formData.rollNumber,
      mobileNumber: formData.mobileNumber,
      class: formData.mobileNumber,
      question: "What electives are you choosing?",
      answer: selectedNames,
    };
    createUserData(data);
    setResponseCounts(updatedCounts);
    console.log("selectedNames:::data", data);
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "auto",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <Title level="H2" style={{ textAlign: "center", marginBottom: "2rem" }}>
        MBA Elective Selection Form
      </Title>

      {message && (
        <MessageStrip
          type="Information"
          style={{ marginBottom: "1.5rem" }}
          onClose={() => setMessage("")}
        >
          {message}
        </MessageStrip>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Form Fields in Flex Row */}
        {[
          {
            label: "Full Name",
            field: "name",
            placeholder: "Enter your full name",
          },
          {
            label: "Roll Number",
            field: "rollNumber",
            placeholder: "Enter your roll number",
          },
          {
            label: "Mobile Number",
            field: "mobileNumber",
            placeholder: "Enter your mobile number",
          },
        ].map(({ label, field, placeholder }) => (
          <div
            key={field}
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <Label style={{ flex: "0 0 150px" }} showColon>
              {label}
            </Label>
            <Input
              style={{ flex: 1 }}
              value={formData[field]}
              placeholder={placeholder}
              onInput={(e) => handleInput(field, e.target.value)}
            />
          </div>
        ))}

        {/* Class Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Label style={{ flex: "0 0 150px" }} showColon>
            Class
          </Label>
          <ComboBox
            style={{ flex: 1 }}
            onChange={(e) => handleInput("class", e.target.value)}
            value={formData.class}
            placeholder="Select your class"
          >
            {classList.map((c, i) => (
              <ComboBoxItem key={i} text={c.CLASSNAME} />
            ))}
          </ComboBox>
        </div>

        {/* Electives */}
        <div style={{ marginTop: "2rem" }}>
          <Title level="H4" style={{ marginBottom: "1rem", textAlign: "left" }}>
            What electives are you choosing?
          </Title>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem", // Adjusted the gap between items to make it more uniform
              justifyContent: "flex-start", // Align items to the left
            }}
          >
            {electivesList.map((elective, index) => (
              <div
                key={index}
                style={{
                  flexBasis: "calc(50% - 1rem)",
                  textAlign: "left",
                  alignItems: "center",
                }}
              >
                <CheckBox
                  text={elective.ELECTIVENAME}
                  checked={selectedElectives.includes(index)}
                  onChange={(e) =>
                    handleCheckboxChange(
                      index,
                      e.target.checked,
                      elective.ELECTIVENAME
                    )
                  }
                  disabled={!!disabledElectives[elective.ELECTIVENAME]}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          design="Emphasized"
          style={{
            marginTop: "2rem",
            width: "100%",
            padding: "0.75rem",
            fontWeight: "bold",
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
