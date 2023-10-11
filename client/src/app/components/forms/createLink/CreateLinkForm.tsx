import React, { DetailedHTMLProps, FC, HTMLAttributes, useState } from "react";
import cn from "classnames";
import { Form, Formik } from "formik";
import { Input } from "app/components/ui/Input";
import { Button } from "app/components/ui/Button";
import { useAppDispatch } from "app/store/store";
import { useNavigate } from "react-router-dom";
import { CreateLinkValidationSchema } from "./validationSchema";
import { Text } from "app/components/ui/Text";
import { createLink } from "app/store/link/asyncActions";
import { ILinkRequest } from "app/types/Link";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  onSubmit: () => any;
}

const typesDictionary = { SINGLE: "Single", MULTIPLE: "Multiple" };
const numberOfDays = [1, 3, 7];

export const CreateLinkForm: FC<Props> = ({
  onSubmit,
  className,
  ...props
}) => {
  const [initialValues, setInitialValues] = useState<ILinkRequest>({
    redirectLink: "",
    numberOfDays: 1,
    type: "SINGLE",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <Formik
      validationSchema={CreateLinkValidationSchema}
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={async (data) => {
        const res = await dispatch(
          createLink({
            redirectLink: data.redirectLink,
            numberOfDays: data.numberOfDays,
            type: data.type,
          })
        );

        if (res.meta.requestStatus === "rejected") {
          return alert(res.payload);
        }

        //reset
        setInitialValues({
          redirectLink: "",
          numberOfDays: 1,
          type: "SINGLE",
        });
        onSubmit();
      }}
    >
      {({ values, setValues, errors }) => (
        <Form>
          <Input className="mb-4" label="Redirect link" name="redirectLink" />
          <div className="mb-4">
            <Text className="font-semibold mb-1" size="s">
              Type of entries
            </Text>
            <div className="flex [&>*+*]:ml-2 ">
              {Object.entries(typesDictionary).map(([type, dic]) => (
                <Button
                  key={type}
                  onClick={() =>
                    //@ts-ignore
                    setValues((value) => ({ ...value, type: type }))
                  }
                  color={values.type === type ? "black" : "white"}
                >
                  {dic}
                </Button>
              ))}
            </div>
          </div>
          <div className="mb-10">
            <Text className="font-semibold mb-1" size="s">
              Number of days
            </Text>
            <div className="flex [&>*+*]:ml-2">
              {numberOfDays.map((num) => (
                <Button
                  key={num}
                  onClick={() =>
                    //@ts-ignore
                    setValues((value) => ({ ...value, numberOfDays: num }))
                  }
                  color={values.numberOfDays === num ? "black" : "white"}
                >
                  {num} {num > 1 ? "days" : "day"}
                </Button>
              ))}
            </div>
          </div>
          <Button className="w-full" color="black" type="submit">
            Create
          </Button>
        </Form>
      )}
    </Formik>
  );
};
