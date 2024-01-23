"use strict"
import { useState, useEffect } from 'react';
import { Duty } from '../components/Duties/DutyItem';

type SuccessResponse<T> = {
  data: T;
};

type FailResponse= {
  error: string;
};

type DutiesData = Array<{
  id: string;
  name: string;
}>

type DutiesSuccessResponse = SuccessResponse<DutiesData>;

type DutiesResponse = DutiesSuccessResponse | FailResponse;

type Method = "GET" | "POST" | "PUT";

const getRequestConfig = (method: Method) => <T>(input: T) => {
  switch (method) {
    case "GET": {
      return {}
    }
    case "POST": {
      return {
        body: JSON.stringify({ duties: input})
      }
    }
    case "PUT": {
      return {
        body: JSON.stringify({ duties: input})
      }
    }
    default: 
      throw Error(`Unsupport method : ${method}`)
  }
};

// Convert the format of the data received from the server to frontend
const convertDutiesDTOToDuties = (duties: DutiesData) => {
  return duties.map(duty => ({ id: duty.id, name: duty.name }));
};

const useDuties = () => {
  const [duties, setDuties] = useState<Duty[]>([]);
  const [initialDuites, setInitialDuites] = useState<Duty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // High order function to do the fetching
  const fetchData = (fetchInput: Parameters<typeof fetch>[0]) => (method: Method) => async <T>(input: T) => {
    try {
      setIsLoading(true);
      const response = await fetch(fetchInput, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        ...getRequestConfig(method)(input)
      });
      const dutiesResponse: DutiesResponse = await response.json();
      if ("error" in dutiesResponse) {
        throw Error(dutiesResponse.error);
      } 
      const data = dutiesResponse.data || [];
      const duties = convertDutiesDTOToDuties(data);
      setDuties(duties);
      return duties;
    } catch (error) {
      return duties;
    } finally {
      setIsLoading(false);
    }
  }

  // Partial apply the fetchData function with method
  const getDuties = fetchData("http://localhost:5001/duties")("GET")<null>;
  const updateDuties = fetchData("http://localhost:5001/duties")("POST")<Duty[]>;

  useEffect(() => {
    setIsLoading(true);
    // Get the initial duties
    getDuties(null)
      .then(duties => setInitialDuites(duties))
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);
  
  return { duties, initialDuites, setDuties, updateDuties, isLoading}
}

export default useDuties;
