import qs from 'qs';
import { requestData } from './dataFetch';
import { postalInformationProps } from '../schema/userProps';
import { loginCheck } from '../actions/actionMethods';

export const getPostalInformation = async (documentId: string) => {
  const check = await loginCheck();
  const query = qs.stringify({
    populate: {
      information: { populate: '1' },
    },
  });

  const response = await requestData(
    `/postal-informations/${documentId}?${query}`,
    'GET',
    {},
    check.jwt
  );
  return response.data;
};

export const updatePostalInformation = async (
  newAddressList: postalInformationProps[],
  id: string
) => {
  const check = await loginCheck();
  const response = await requestData(
    `/postal-informations/${id}`,
    'PUT',
    {
      data: {
        information: newAddressList.map((item) => ({
          address: item.address,
          province: item.province,
          city: item.city,
          firstName: item.firstName,
          lastName: item.lastName,
          mobileNumber: item.mobileNumber,
          phoneNumber: item.phoneNumber,
          postCode: item.postCode,
        })),
      },
    },
    check.jwt
  );
  const data = response.data;
  return data;
};
