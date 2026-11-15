import { useEffect, useState, createContext, useMemo } from "react";
import { useRouter } from "next/router";

import { InitialPageMeta } from "@/components/MetaData/MetaData";
import SearchPage from "@/components/SearchPage/SearchPage";
import highlightStyles from "@/components/SearchPage/SearchHighlightText/SearchHighlightText.module.scss";
import { highlightSearchText } from "@/utils/highlightSearchText";

import { useScrollRestoration } from "@/hooks/useScrollRestoration";

import { serviceUrl } from "@/constants/serviceurl";
import { event as gtagEvent } from "@/constants/gtag";

interface SearchHighlightContextType {
  highlight: (text: string) => React.ReactNode;
  keyword: string;
}

export const SearchHighlightContext = createContext<SearchHighlightContextType>({
  highlight: (text: string) => text,
  keyword: "",
});

export default function Search() {
  const router = useRouter();
  const [OGTitle] = useState("검색 결과 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  useScrollRestoration("search-scroll");

  const keyword =
    typeof router.query.keyword === "string" ? decodeURIComponent(router.query.keyword) : "";

  const highlightContextValue = useMemo(
    () => ({
      keyword,
      highlight: (text: string) => highlightSearchText(text, keyword, highlightStyles.highlight),
    }),
    [keyword],
  );

  useEffect(() => {
    setOGUrl(`${serviceUrl}/${router.asPath}`);
  }, [router.asPath]);

  useEffect(() => {
    if (keyword) {
      gtagEvent({
        action: "search",
        category: "engagement",
        label: keyword,
      });
    }
  }, [keyword]);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <SearchHighlightContext.Provider value={highlightContextValue}>
        <SearchPage />
      </SearchHighlightContext.Provider>
    </>
  );
}
