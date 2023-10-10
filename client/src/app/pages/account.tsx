import React, {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  useEffect,
  useState,
} from "react";
import cn from "classnames";
import { DefaultLayout } from "app/layout/DefaultLayout";
import { Heading } from "app/components/ui/Heading";
import { Text } from "app/components/ui/Text";
import { Button } from "app/components/ui/Button";
import { useAppDispatch, useAppSelector } from "app/store/store";
import { selectUser } from "app/store/user/slice";
import { Navigate, useNavigate } from "react-router-dom";
import { selectLinks, visitLink } from "app/store/link/slice";
import {
  deactivateLink,
  deleteLink,
  getAllLinks,
  getLinkById,
} from "app/store/link/asyncActions";
import { ApiRoutes } from "app/types/ApiRoutes";
import { Modal } from "app/components/ui/Modal";
import { CreateLinkForm } from "app/components/forms/createLink/CreateLinkForm";
import { withAuth } from "app/utils/HOCs/withAuth";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const AccountPage: FC<Props> = ({ className, ...props }) => {
  const user = useAppSelector(selectUser);
  const links = useAppSelector(selectLinks);
  const dispatch = useAppDispatch();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const onDeactivateLinkHandle = (id: string) => {
    const res = dispatch(deactivateLink({ id }));
  };

  const onDeleteLinkHandle = (id: string) => {
    const res = dispatch(deleteLink({ id }));
  };

  useEffect(() => {
    (function fetchLinks() {
      dispatch(getAllLinks());
    })();
  }, [dispatch]);

  return (
    <DefaultLayout {...props}>
      <div className="mb-16">
        <Heading size="m" className="underline underline-offset-2 mb-2">
          Welcome, {user?.firstName || "User"}!
        </Heading>
        <Text className="mb-3">
          Here's your account pannel. Here you can manage all your recently
          created links
        </Text>
        <Button size="s" color="black" onClick={() => setIsModalVisible(true)}>
          Create new link
        </Button>
        <Modal
          onClose={() => {
            setIsModalVisible(false);
          }}
          isActive={isModalVisible}
        >
          <CreateLinkForm onSubmit={() => setIsModalVisible(false)} />
        </Modal>
      </div>
      <div>
        <Heading className="mb-3" size="s" htmlEl="h2">
          Links collection
        </Heading>
        {links.length ? (
          <ul className="[&>*+*]:mt-4">
            {links.map((link) => (
              <li key={link.id}>
                <div className="border-[1px] border-black py-3 px-5 inline-block w-full max-w-[400px]">
                  <Text
                    className="pb-2 whitespace-nowrap overflow-scroll"
                    size="l"
                  >
                    {link.redirectLink.replace(/^(http|https):\/\//, "")}
                  </Text>
                  <div className="mb-5 [&>*+*]:mt-1">
                    <Text size="s">Active: {link.active ? "Yes" : "No"}</Text>
                    {link.type !== "SINGLE" && (
                      <Text size="s">Visits: {link.visits}</Text>
                    )}
                    <Text size="s">
                      Type:{" "}
                      {link.type === "SINGLE"
                        ? "Single entry"
                        : "Multiple entry"}
                    </Text>
                    <Text size="s">
                      Active till: {new Date(link.expiredAt).toString()}
                    </Text>
                  </div>
                  <Text className="mb-1" size="s">
                    <a
                      target="_blank"
                      className="underline underline-offset-2"
                      href={
                        import.meta.env.VITE_API_URL +
                        ApiRoutes.VisitLink +
                        link.id
                      }
                      rel="noreferrer"
                      onClick={() => {
                        dispatch(visitLink({ id: link.id }));
                        dispatch(getLinkById({ id: link.id }));
                      }}
                    >
                      Visit link
                    </a>
                  </Text>
                  <div className="[&>*+*]:ml-2">
                    {link.active && (
                      <Button
                        color="white"
                        onClick={() => onDeactivateLinkHandle(link.id)}
                      >
                        Deactivate
                      </Button>
                    )}
                    <Button
                      color="black"
                      onClick={() => onDeleteLinkHandle(link.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Text className="py-3 px-4 bg-gray-500 inline-block text-white font-semibold">
            You don't have any link created yet...
          </Text>
        )}
      </div>
    </DefaultLayout>
  );
};

export default withAuth(AccountPage);
