/* eslint-disable newline-before-return */
import { FC, SyntheticEvent } from 'react';
import {
  Message,
  Dimmer,
  Loader,
  Select,
  DropdownProps,
} from 'semantic-ui-react';
import { CreateFacilityInput } from '../../API';

export type SelectOptionType = {
  key: string;
  value: string;
  text: string;
};

export interface FacilitySelectInterface {
  list: CreateFacilityInput[];
  placeholder?: string;
  disable?: boolean;
  onChange: (_: SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
}

export const FacilitySelect: FC<FacilitySelectInterface> = (props) => {
  const { list, placeholder, disable, onChange } = props;
  return (
    <Select
      placeholder={placeholder}
      disabled={disable ? disable : false}
      onChange={onChange}
      options={((): Array<SelectOptionType> => {
        return list.map((v) => {
          return { key: v.id, value: v.id, text: v.name };
        });
      })()}
    />
  );
};

export type APIErrorType = { errors: Array<{ message: string }> };

export type AppErrorInterface = {
  isError: boolean;
  message: string;
};

export const AppError: FC<AppErrorInterface> = (error) => {
  if (!error.isError) return <></>;

  return (
    <Message negative>
      <Message.Header>Someting Error occured.</Message.Header>
      {error.message}
    </Message>
  );
};

interface LoadingInterface {
  active: boolean;
}

export const Loading: FC<LoadingInterface> = (props) => {
  return (
    props.active && (
      <Dimmer active page>
        <Loader>Loading</Loader>
      </Dimmer>
    )
  );
};
