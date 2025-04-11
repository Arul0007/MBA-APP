import React, { useState, useEffect } from "react";
import {
  Input,
  Title,
  Label,
  CheckBox,
  Button,
  MessageStrip,
  FlexBox,
  ComboBoxItem,
  ComboBox,
  Form,
  FormGroup,
  FormItem,
} from "@ui5/webcomponents-react";
import Config from "../Config";
import axios from "axios";

const MAX_RESPONSES_PER_ELECTIVE = 50;

export default function ElectiveForm() {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    mobileNumber: "",
    class: "",
    question: "",
    answer: [],
  });

  const [selectedElectives, setSelectedElectives] = useState([]);

  const [message, setMessage] = useState("");

  const handleInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  const [classList, setClassList] = useState([]);
  const [electivesList, setElectivesList] = useState([
    { ELECTIVENAME: "Marketing Analytics" },
    { ELECTIVENAME: "Strategic Finance" },
    { ELECTIVENAME: "Digital Transformation" }
  ]);
  const getClassList = async () => {
    const url = Config.GET_CLASS_LIST;
    await axios
      .get(url)
      .then((result) => {
        setClassList(result.data);
      })
      .catch((e) => {
        console.log("Error: Cannot get Class List:::", e);
      });
  };

  const getElectiveList = async () => {
    const url = Config.GET_ELECTIVE_LIST;
    await axios
      .get(url)
      .then((result) => {
        setElectivesList(result.data);
      })
      .catch((e) => {
        console.log("Error: Cannot get Class List:::", e);
      });
  };

  useEffect(() => {
    getClassList();
    getElectiveList();
  }, []);
  const [responseCounts, setResponseCounts] = useState(
    Array(electivesList.length).fill(0)
  );
  const handleCheckboxChange = (index, checked, text) => {
    console.log("e::::handleCheckboxChange", text);
    const updated = [...selectedElectives];
    if (checked) {
      if (responseCounts[index] >= MAX_RESPONSES_PER_ELECTIVE) {
        setMessage(`"${electivesList[index]}" has reached the response limit.`);
        return;
      }
      updated.push(text);
    } else {
      const idx = updated.indexOf(index);
      if (idx > -1) updated.splice(idx, 1);
    }
    setSelectedElectives(updated);
  };
  console.log("selectedElectives::::", selectedElectives);
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
      if (updatedCounts[index] < MAX_RESPONSES_PER_ELECTIVE) {
        updatedCounts[index]++;
        selectedNames.push(electivesList[index]);
      }
    });

    setResponseCounts(updatedCounts);
    setSelectedElectives([]);
    setFormData({ name: "", rollNumber: "", mobileNumber: "", class: "" });
    setMessage(
      `Successfully submitted. Selected electives: ${selectedNames.join(", ")}`
    );
  };

  return (
    // <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
    //   {message && (
    //     <MessageStrip
    //       style={{ marginTop: "1rem" }}
    //       type="Information"
    //       noCloseButton={(e) => setMessage("")}
    //     >
    //       {message}
    //     </MessageStrip>
    //   )}
    //   {/* <FlexBox
    //     alignItems="Stretch"
    //     direction="Column"
    //     justifyContent="Start"
    //     wrap="NoWrap"
    //   >
    //     <Title level="H2">MBA Elective Selection Form</Title> */}
    //   {/* <FlexBox alignItems="Row" justifyContent="SpaceAround">
    //       <Label>Full Name</Label>
    //       <Input
    //         value={formData.name}
    //         onInput={(e) => handleInput("name", e.target.value)}
    //         placeholder="Enter your full name"
    //       />
    //     </FlexBox>
    //     <FlexBox alignItems="Row" justifyContent="SpaceAround">
    //       <Label>Roll Number</Label>
    //       <Input
    //         value={formData.rollNumber}
    //         onInput={(e) => handleInput("rollNumber", e.target.value)}
    //         placeholder="Enter your roll number"
    //       />
    //     </FlexBox>
    //     <FlexBox alignItems="Row" justifyContent="SpaceAround">
    //       <Label>Mobile Number</Label>
    //       <Input
    //         value={formData.mobileNumber}
    //         onInput={(e) => handleInput("mobileNumber", e.target.value)}
    //         placeholder="Enter your mobile number"
    //       />
    //     </FlexBox>
    //     <FlexBox alignItems="Row" justifyContent="SpaceAround">
    //       <Label>Class</Label>
    //       <ComboBox
    //         onChange={(e) => handleInput("class", e.target.value)}
    //         value={formData.class}
    //       >
    //         {classList &&
    //           classList.length > 0 &&
    //           classList.map((d, index) => (
    //             <ComboBoxItem
    //               key={index}
    //               id="class"
    //               name="class"
    //               text={d.CLASSNAME}
    //             />
    //           ))}
    //       </ComboBox>
    //     </FlexBox>

    //     <FlexBox alignItems="Row" justifyContent="Start">
    //       <Title level="H4" style={{ marginTop: "2rem" }}>
    //         What electives are you choosing
    //       </Title>
    //     </FlexBox>
    //     <FlexBox alignItems="Row" justifyContent="SpaceAround">
    //       <div
    //         style={{
    //           display: "grid",
    //           gridTemplateColumns: "1fr 1fr",
    //           gap: "0.5rem",
    //         }}
    //       >
    //         {electivesList.map((elective, index) => (
    //           <CheckBox
    //             key={index}
    //             text={elective.ELECTIVENAME}
    //             checked={selectedElectives.includes(index)}
    //             onChange={(e) =>
    //               handleCheckboxChange(index, e.target.checked, e.target.text)
    //             }
    //             disabled={responseCounts[index] >= MAX_RESPONSES_PER_ELECTIVE}
    //           />
    //         ))}
    //       </div>
    //     </FlexBox>
    //     <Button
    //       design="Emphasized"
    //       style={{ marginTop: "1.5rem" }}
    //       onClick={handleSubmit}
    //     >
    //       Submit
    //     </Button> */}
    //   {/* </FlexBox> */}

    //   <Form
    //     backgroundDesign="Transparent"
    //     columnsL={2}
    //     columnsM={2}
    //     columnsS={1}
    //     columnsXL={2}
    //     labelSpanL={4}
    //     labelSpanM={4}
    //     labelSpanS={12}
    //     labelSpanXL={4}
    //   // style={{
    //   //   alignItems: "right",
    //   //   marginTop: "20px",
    //   // }}
    //   >
    //     <FormGroup>
    //       <FormItem>
    //         <Title level="H2">MBA Elective Selection Form</Title>
    //       </FormItem>
    //       <FormItem>
    //         <Label>Full Name :</Label>
    //         <Input
    //           value={formData.name}
    //           onInput={(e) => handleInput("name", e.target.value)}
    //           placeholder="Enter your full name"
    //         />
    //       </FormItem>
    //       <FormItem>
    //         <Label>Roll Number :</Label>
    //         <Input
    //           value={formData.rollNumber}
    //           onInput={(e) => handleInput("rollNumber", e.target.value)}
    //           placeholder="Enter your roll number"
    //         />
    //       </FormItem>
    //       <FormItem>
    //         <Label>Mobile Number :</Label>
    //         <Input
    //           value={formData.mobileNumber}
    //           onInput={(e) => handleInput("mobileNumber", e.target.value)}
    //           placeholder="Enter your mobile number"
    //         />
    //       </FormItem>
    //       <FormItem>
    //         <Label>Class :</Label>
    //         <ComboBox
    //           onChange={(e) => handleInput("class", e.target.value)}
    //           value={formData.class}
    //         >
    //           {classList &&
    //             classList.length > 0 &&
    //             classList.map((d, index) => (
    //               <ComboBoxItem
    //                 key={index}
    //                 id="class"
    //                 name="class"
    //                 text={d.CLASSNAME}
    //               />
    //             ))}
    //         </ComboBox>
    //       </FormItem>
    //       <FormItem>
    //         <Title level="H4" style={{ marginTop: "2rem" }}>
    //           What electives are you choosing
    //         </Title>
    //       </FormItem>
    //       <FormItem>
    //         <div
    //           style={{
    //             display: "grid",
    //             gridTemplateColumns: "1fr 1fr",
    //             gap: "0.5rem",
    //           }}
    //         >
    //           {electivesList.map((elective, index) => (
    //             <CheckBox
    //               key={index}
    //               text={elective.ELECTIVENAME}
    //               checked={selectedElectives.includes(index)}
    //               onChange={(e) =>
    //                 handleCheckboxChange(index, e.target.checked, e.target.text)
    //               }
    //               disabled={responseCounts[index] >= MAX_RESPONSES_PER_ELECTIVE}
    //             />
    //           ))}
    //         </div>
    //       </FormItem>
    //       <FormItem>
    //         <Button
    //           design="Emphasized"
    //           style={{ marginTop: "1.5rem" }}
    //           onClick={handleSubmit}
    //         >
    //           Submit
    //         </Button> */}
    //       </FormItem>
    //     </FormGroup>
    //   </Form>
    // </div>
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <Title level="H2" style={{ textAlign: "center", marginBottom: "2rem" }}>
        MBA Elective Selection Form
      </Title>

      {message && (
        <MessageStrip
          type="Information"
          style={{ marginBottom: "1rem" }}
          onClose={() => setMessage("")}
        >
          {message}
        </MessageStrip>
      )}

      <Form columnsS={1}>
        <FormGroup>
          <FormItem label="Full Name">
            <Input
              value={formData.name}
              onInput={(e) => handleInput("name", e.target.value)}
              placeholder="Enter your full name"
            />
          </FormItem>

          <FormItem label="Roll Number">
            <Input
              value={formData.rollNumber}
              onInput={(e) => handleInput("rollNumber", e.target.value)}
              placeholder="Enter your roll number"
            />
          </FormItem>

          <FormItem label="Mobile Number">
            <Input
              value={formData.mobileNumber}
              onInput={(e) => handleInput("mobileNumber", e.target.value)}
              placeholder="Enter your mobile number"
            />
          </FormItem>

          <FormItem label="Class">
            <ComboBox
              onChange={(e) => handleInput("class", e.target.value)}
              value={formData.class}
            >
              {classList?.map((d, index) => (
                <ComboBoxItem key={index} text={d.CLASSNAME} />
              ))}
            </ComboBox>
          </FormItem>
        </FormGroup>

        <Title level="H4" style={{ marginTop: "2rem" }}>
          Select Your Electives
        </Title>

        <FormItem>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {electivesList?.map((elective, index) => (
              <CheckBox
                key={index}
                text={elective.ELECTIVENAME}
                checked={selectedElectives.includes(index)}
                onChange={(e) =>
                  handleCheckboxChange(index, e.target.checked, e.target.text)
                }
                disabled={responseCounts[index] >= MAX_RESPONSES_PER_ELECTIVE}
              />
            ))}
          </div>
        </FormItem>

        <FormItem>
          <Button
            design="Emphasized"
            style={{ marginTop: "2rem", width: "100%" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </FormItem>
      </Form>
    </div>

  );
}
