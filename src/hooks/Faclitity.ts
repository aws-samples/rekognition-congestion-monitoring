/* eslint-disable newline-before-return */
import { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listFacilitys } from '../graphql/queries';
import {
  createFacility,
  updateFacility,
  deleteFacility,
} from '../graphql/mutations';
import {
  CreateFacilityInput,
  UpdateFacilityInput,
  DeleteFacilityInput,
  RecordingStatus,
  ListFacilitysQuery,
  ListFacilitysQueryVariables,
} from '../API';
import { AppErrorInterface } from '../components/common';

type ApiResponse = {
  data: ListFacilitysQuery;
};

const useFacility = (
  variables: ListFacilitysQueryVariables = {}
): {
  list: CreateFacilityInput[];
  loading: boolean;
  error: AppErrorInterface;
  createOne: (input: CreateFacilityInput) => void;
  updateOne: (input: UpdateFacilityInput) => void;
  deleteOne: (input: DeleteFacilityInput) => void;
} => {
  const [list, setList] = useState<CreateFacilityInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppErrorInterface>({
    isError: false,
    message: '',
  });

  useEffect(() => {
    const f = async () => {
      setLoading(true);
      // 施設一覧を取得
      try {
        const result = (await API.graphql(
          graphqlOperation(listFacilitys, variables.filter)
        )) as ApiResponse;
        setList(result.data.listFacilitys.items);
      } catch {
        setError({
          isError: true,
          message: '施設情報の取得に失敗しました',
        });
      } finally {
        setLoading(false);
      }
    };
    f();
  }, []);

  const createOne = async (input: CreateFacilityInput) => {
    setLoading(true);
    // 施設を作成
    try {
      await API.graphql(
        graphqlOperation(createFacility, {
          input: {
            ...input,
            numberOfPeople: 0,
            recordingStatus: RecordingStatus.INACTIVE,
          },
        })
      );
    } catch {
      setError({
        isError: true,
        message: '施設情報の作成に失敗しました。',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOne = async (input: UpdateFacilityInput) => {
    setLoading(true);
    // 施設を削除
    try {
      await API.graphql(
        graphqlOperation(updateFacility, {
          input,
        })
      );
      setList(
        list.filter((v) => {
          return v.id !== input.id;
        })
      );
    } catch {
      setError({
        isError: true,
        message: '施設情報の更新に失敗しました。',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteOne = async (input: DeleteFacilityInput) => {
    setLoading(true);
    // 施設を削除
    try {
      await API.graphql(
        graphqlOperation(deleteFacility, {
          input,
        })
      );
      setList(
        list.filter((v) => {
          return v.id !== input.id;
        })
      );
    } catch {
      setError({
        isError: true,
        message: '施設情報の削除に失敗しました。',
      });
    } finally {
      setLoading(false);
    }
  };

  return { list, loading, error, createOne, updateOne, deleteOne };
};
export default useFacility;
