import moment from "moment";

interface Timestamp {
    nanos_since_epoch: number
    secs_since_epoch: number
}

export interface AccountInfoRead {
    account_id: number
    name: string
    created_at: Timestamp
    stars: number
    about?: string
}

export interface ProjectListRequest {
    limit?: number
    offset?: number
}

export interface ProjectInfoCreate {
    project_name: string
    project_description?: string
}

export interface ProjectInfoRead {
    project_id: number
    account_id: number
    project_name: string
    project_description: string
    created_at: Timestamp
    stars: number
}

export interface ModelInfoCreate {
    model_name: string
    model_description?: string
}

export interface ModelMinifiedInfoRead {
    model_id: number
    account_id: number
    model_name: string
    model_description?: string
    uploaded_at: Timestamp
    stars: number
}

export interface ModelCompleteInfoRead {
    model_id: number
    account_id: number
    model_name: string
    model_description?: string
    model_ifc: string
    uploaded_at: Timestamp
    stars: number
}

export interface MeshInfoCreate {
    mesh_name: string
    mesh_description: string
    ply_contents: string
}

export interface MeshMinInfoRead {
    mesh_id: number
    account_id: number
    mesh_name: string
    mesh_description?: string
    uploaded_at: Timestamp
    stars: number
}

export interface MeshCompleteInfoRead {
    mesh_id: number
    account_id: number
    mesh_name: string
    mesh_description?: string
    ply_contents: string
    uploaded_at: Timestamp
    stars: number
}

export interface StageInfoCreate {
    project_id: number
    mesh_id: number
    stage_description?: string
}

export interface StageInfoRead {
    stage_id: number
    project_id: number
    mesh_id: number
    account_id: number
    stage_description?: string
    position_z: number
    created_at: Timestamp
    stars: number
}

export interface StateToModelLinkInfoCreate {
    link_description?: string
    position_x: number
    position_y: number
    position_z?: number
    rotation_x: number
    rotation_y: number
    rotation_z: number
}

export interface StageToModelLinkInfoRead {
    link_id: number
    model_id: number
    stage_id: number
    account_id: number
    created_at: Timestamp
    link_description?: string
    position_x: number
    position_y: number
    position_z?: number
    rotation_x: number
    rotation_y: number
    rotation_z: number
}

export interface PositionedCompleteModelInfoRead {
    model_id: number
    position_x: number
    position_y: number
    position_z?: number
    rotation_x: number
    rotation_y: number
    rotation_z: number
    model_name: string
    model_description?: string
    model_ifc: string
}

export interface CompleteStageInfoRead {
    account_id: number
    stage_id: number
    mesh_id: number
    models: PositionedCompleteModelInfoRead[]
}

export const formatTimestampForLocale = (a: Timestamp | undefined): string => {
    if (a) {
        return moment.unix(a.secs_since_epoch).format("LLL")
    }
    return ''
}

export type LoadingState = 'PENDING' | 'DONE' | 'ERRORED';

export interface Credentials {
    name: string,
    password: string
}

export interface RegistrationInfo extends Credentials {
}

export interface AuthorizationInfo {
    username: string,
    password: string
}