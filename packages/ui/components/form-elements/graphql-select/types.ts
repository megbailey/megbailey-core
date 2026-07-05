import type { DocumentNode } from "@apollo/client";
import type { GroupBase, OnChangeValue, OptionsOrGroups } from "react-select";

import type { InformedSelectOption } from "../informed-select/types";
import type { FormFieldChangeEvent } from "../types";

export type GraphQLSelectChangeEvent<TItem> = FormFieldChangeEvent<TItem | TItem[]>;

export type GraphQLSelectItem = Record<string, unknown> & {
    label?: string;
    name?: string;
    title?: string;
};

export type GraphQLSelectProps<TItem extends GraphQLSelectItem = GraphQLSelectItem> = {
    label?: string;
    field?: string;
    initialValue?: TItem | TItem[];
    endpointDataPath?: string;
    query?: DocumentNode;
    queryVariables?: Record<string, unknown>;
    attachAbortController?: boolean;
    formatOptionLabel?: (item: TItem) => string;
    formatGroupLabel?: (group: GroupBase<InformedSelectOption>) => string;
    groupOptionsCallback?: (
        options: InformedSelectOption[]
    ) => OptionsOrGroups<InformedSelectOption, GroupBase<InformedSelectOption>>;
    onLoadingChange?: (loading: boolean) => void;
    onChange?: (event: GraphQLSelectChangeEvent<TItem>) => void;
    isMulti?: boolean;
    isDisabled?: boolean;
    placeholder?: string;
};

export type ParseJSONOptionValueEvent = FormFieldChangeEvent<
    OnChangeValue<InformedSelectOption, boolean>
>;
