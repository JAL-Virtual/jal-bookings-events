import { useContext } from "react";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { ONE_DAY } from "../../constants/appConstants";
import { IocContext } from "../../contexts/IocContext";
import { Event } from "../../types/Event";
