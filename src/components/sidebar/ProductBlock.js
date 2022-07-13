import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import {
  Button,
  Heading,
  FormLayout,
  ChoiceList,
  Spinner,
  Select,
  Modal,
  TextContainer,
  TextField,
} from "@shopify/polaris";
import {
  RemovePadding,
  RadioGroup,
  SidePanel,
  SidePanelArea,
  Header,
  BackAction,
  ButtonWrapper,
  TitleWrapper,
  Flex,
  Section as SectionElement,
  SidePanelBottom,
  ButtonRightWrapper,
} from "@styles/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { DeleteMinor, ChevronLeftMinor } from "@shopify/polaris-icons";


const MyForm = () => {
  let { handle } = useParams();
  const navigate = useNavigate();
  return (
    <SidePanel>
      <SidePanelArea>
        <SectionElement>
          <FormLayout>
            

<Form
    onSubmit={() => {}}
    mutators={{
      ...arrayMutators,
    }}
    render={({ handleSubmit, pristine, invalid, values }) => (
      <form onSubmit={handleSubmit}>
        
        <FieldArray name="values">
          {({ fields }) => (
            <div>
              <Select
                    label="Number of columns"
                    options={[
                      {
                        label: 1,
                        value: 1,
                      },
                      {
                        label: 2,
                        value: 2,
                      },
                      {
                        label: 3,
                        value: 3,
                      },
                      {
                        label: 4,
                        value: 4,
                      },
                    ]}
                  onChange={() => console.log(fields)}
                  value={1}
              />
              {fields.map((name, index) => (
                <div key={name}>
                  <Header>
                    <BackAction
                      className={"space-between"}
                      style={{ justifyContent: "space-between" }}
                    >
                      <TitleWrapper style={{ padding: 0 }}>
                        <Heading>
                          <span className="capitalize">{`Column ${name}`}</span>
                        </Heading>
                      </TitleWrapper>
                      <ButtonRightWrapper style={{ width: "auto" }}>
                        <Button
                          onClick={() => {
                            // editCSSHandle(col, (name));
                            navigate(`/block/css/${handle}-column-${index}`, {
                              back : `/product/${handle}`
                          });
                          }}
                        >
                          Edit CSS
                        </Button>
                      </ButtonRightWrapper>
                    </BackAction>
                  </Header>
                  <SectionElement>
                    <RemovePadding>
                      <RadioGroup style={{ marginTop: 5 }}>
                        <Field
                          type="select"
                          name={`${name}.contentType`}
                        >
                          {(props) => (
                            <div>
                              <ChoiceList
                                title="Content type"
                                choices={[
                                  { label: "Button", value: "button" },
                                  { label: "Text", value: "text" },
                                ]}
                                selected={
                                  props.input.value ? props.input.value : "text"
                                }
                                value={props.input.value}
                                onChange={props.input.onChange}
                              />
                            </div>
                          )}
                        </Field>
                      </RadioGroup>
                    </RemovePadding>
                    <div style={{ marginTop: 10 }}>
                      <Field name={`${name}.content`}>
                        {({ input, meta, ...rest }) => (
                          <div>
                            <TextField
                              label="Content"
                              name={input.name}
                              value={input.value}
                              onChange={(val) => {
                                input.onChange(val);
                                // updateValues(col.key, input)
                              }}
                              multiline={4}
                              showCharacterCount
                              maxLength={500}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                  </SectionElement>
                </div>
              ))}
            </div>
          )}
        </FieldArray>
        <pre style={{
                  height: "195px",
                  color: "#666",
                  tabSize: 4,
                  overflow: "auto",
                  padding: "10px",
                  border: "1px solid #e5e5e5",
                  borderRadius: "3px",
                  background: "#eee"
                }}>
                  <code>{JSON.stringify(values, null, 2)}</code>
                </pre>
      </form>
    )}
  />
          </FormLayout>
        </SectionElement>
      </SidePanelArea>
      <SidePanelBottom>
        <Button
          onClick={() => {}}
          plain
          monochrome
          removeUnderline
          icon={DeleteMinor}
        >
          Delete Section
        </Button>
      </SidePanelBottom>
    </SidePanel>
  );
};

export default MyForm;
