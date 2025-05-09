/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination, PaginationProps } from "antd";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "src/libs/utils";
import { SearchItem } from "./SearchItem";
import Loading from "src/app/loading";

const SearchList = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const q = searchParams.get("q") ?? "";
    const field = searchParams.get("field") ?? "";
    const category = searchParams.get("category") ?? "";
    const department = searchParams.get("department") ?? "";
    const page = searchParams.get("page") ?? "1";
    const year = searchParams.get("year") ?? "";

    const [size, setSize] = useState(10);

    const query = {
        name: q.trim(),
        field,
        category,
        department,
        year,
    };

    const params = new URLSearchParams({
        name: q,
        field,
        category,
        department,
        year,
        page,
        size: size.toString(),
    });

    // const { sportFields, isLoading, totalPage } = useSearchSportFields({
    //     page: +page,
    //     size,
    //     query: JSON.stringify(query),
    // });

    const {
        data: response,
        error,
        isLoading: swrLoading,
    } = useSWR(
        `/law/search?${params.toString()}`,
        (url: string) => fetcher(url),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const onPageChange: PaginationProps["onChange"] = (pageNumber: number) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set("page", pageNumber.toString());

        router.push(`${pathname}?${currentParams.toString()}` as any, {
            scroll: false,
        });
    };

    if (swrLoading) {
        return (
            <p className="italic text-primary p-4">
                Đang tìm kiếm. Vui lòng chờ trong giây lát
            </p>
        );
    }

    if (!response || error || response.laws.length === 0) {
        return (
            <p className="italic text-primary p-4">
                Không tìm thấy kết quả phù hợp
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-3 flex-grow">
                {response.laws.map((law: any) => (
                    // <SearchCard key={sportField.id} sportField={sportField} />
                    <SearchItem key={law.id} law={law} />
                ))}
            </div>
            <div className="mt-4 px-4">
                <Pagination
                    defaultCurrent={page ? Number(page) : 1}
                    total={response ? response.total : 0}
                    showSizeChanger={false}
                    pageSize={size}
                    align="end"
                    onChange={onPageChange}
                />
            </div>
        </div>
    );
};
export default SearchList;
