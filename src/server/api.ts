import axios, {AxiosProgressEvent, AxiosRequestConfig} from "axios";
import {
    AccountInfoRead,
    AuthorizationInfo,
    CompleteStageInfoRead,
    MeshCompleteInfoRead,
    MeshInfoCreate,
    MeshMinInfoRead,
    ModelCompleteInfoRead,
    ModelInfoCreate,
    ModelMinifiedInfoRead,
    ProjectInfoCreate,
    ProjectInfoRead,
    ProjectListRequest,
    RegistrationInfo,
    StageInfoCreate,
    StageInfoRead,
    StageToModelLinkInfoRead,
    StateToModelLinkInfoCreate
} from './interfaces';

export const getAxiosConfig = (
    token: string,
    params: any,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
): AxiosRequestConfig => {
    return {
        baseURL: "http://localhost:8000",
        headers: {
            "Authorization": `Token ${token}`
        },
        onDownloadProgress: onDownloadProgress,
        onUploadProgress: onUploadProgress,
        params: params,
    }
}

export const listAccounts = async (token: string, limit?: number) => {
    return axios.get(
        "/api/account/list",
        getAxiosConfig(
            token,
            {
                limit: limit
            }
        )
    )
}

export const registerAccount = async (registrationInfo: RegistrationInfo) => {
    return axios.post<AccountInfoRead>(
        "/api/account",
        registrationInfo,
        getAxiosConfig(
            "",
            undefined,
        )
    )
}

export const authorize = async (authorizationInfo: AuthorizationInfo) => {
    return axios.post<string>(
        "/auth",
        authorizationInfo,
        getAxiosConfig(
            "",
            undefined,
        )
    )
}

export const getAccount = async (token: string) => {
    return axios.get<AccountInfoRead>("/api/account", getAxiosConfig(token, undefined))
}

export const listProjects = async (token: string, req: ProjectListRequest) => {
    return axios.get<ProjectInfoRead[]>("/api/project/list", getAxiosConfig(token, req))
}

export const countProjects = async (token: string) => {
    return axios.get<number>("/api/project/count", getAxiosConfig(token, undefined))
}

export const apiCreateProject = async (token: string, pic: ProjectInfoCreate) => {
    return axios.post<ProjectInfoRead>("/api/project", pic, getAxiosConfig(token, undefined))
}

export const uploadModel = async (token: string, mic: ModelInfoCreate, ifc_file: string) => {
    return axios.postForm<ModelMinifiedInfoRead>("/api/model", {
        model_name: mic.model_name,
        model_description: mic.model_description,
        ifc_file: ifc_file
    }, getAxiosConfig(token, undefined))
}

export const listModels = async (token: string, limit?: number, offset?: number) => {
    return axios.get<ModelMinifiedInfoRead[]>(
        "/api/model/list",
        getAxiosConfig(token, {
            limit: limit,
            offset: offset
        })
    )
}

export const readFullModel = async (token: string, model_id: number) => {
    return axios.get<ModelCompleteInfoRead>(
        `/api/model/${model_id}`,
        getAxiosConfig(token, undefined)
    )
}

export const readIfcOfModel = async (token: string, model_id: number) => {
    return axios.get<string>(
        `/api/model/ifc/${model_id}`,
        getAxiosConfig(token, undefined)
    )
}

export const createMesh = async (token: string, mic: MeshInfoCreate) => {
    return axios.post<MeshMinInfoRead>(
        "/api/mesh",
        mic,
        getAxiosConfig(token, undefined)
    )
}

export const listMeshs = async (token: string, limit?: number, offset?: number) => {
    return axios.get<MeshMinInfoRead[]>(
        "/api/mesh/list",
        getAxiosConfig(
            token,
            {
                limit: limit,
                offset: offset
            }
        )
    )
}

export const readMesh = async (token: string, mesh_id: number) => {
    return axios.get<MeshMinInfoRead>(
        `/api/mesh/${mesh_id}`,
        getAxiosConfig(token, undefined)
    )
}

export const readCompleteMesh = async (token: string, mesh_id: number) => {
    return axios.get<MeshCompleteInfoRead>(
        `/api/mesh/complete/${mesh_id}`,
        getAxiosConfig(token, undefined)
    )
}

export const readPlyOfMesh = async (token: string, mesh_id: number) => {
    return axios.get<string>(
        `/api/mesh/ply/${mesh_id}`,
        getAxiosConfig(token, undefined)
    )
}

export const createStage = async (token: string, sic: StageInfoCreate) => {
    return axios.post<StageInfoRead>(
        "/api/stage",
        sic,
        getAxiosConfig(token, undefined)
    )
}

export const listStages = async (token: string, limit?: number, offset?: number) => {
    return axios.get<StageInfoRead[]>(
        "/api/stage/list",
        getAxiosConfig(token, {limit: limit, offset: offset})
    )
}

export const assignModelToStage = async (token: string, stage_id: number, model_id: number, lic: StateToModelLinkInfoCreate) => {
    return axios.post<StageToModelLinkInfoRead>(
        `/api/stage/${stage_id}/assign/${model_id}`,
        lic,
        getAxiosConfig(token, undefined)
    )
}

export const readFullStageInfo = async (token: string, stage_id: number) => {
    return axios.get<CompleteStageInfoRead>(
        `/api/stage/${stage_id}/full/info`,
        getAxiosConfig(token, undefined)
    )
}