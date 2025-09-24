import { toast } from 'react-toastify';
import { useLoaderData } from 'react-router-dom';
import { createContext, useContext } from 'react';
import customFetch from '../utils/customFetch';
import { JobsContainer, SearchContainer } from '../components';
import PageButtonsContainer from '../components/SimplePageButtonsContainer';

export const loader = async ({ request }) => {
  const params = Object.fromEntries(new URL(request.url).searchParams);

  try {
    const { data } = await customFetch.get('/jobs', { params });
    return { data, searchValues: params };
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

const AllJobsContext = createContext();

const AllJobs = () => {
  const { data, searchValues } = useLoaderData();

  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;

// Explanation for line 8
// Let’s carefully break this down piece by piece, because that one-liner packs quite a lot of JavaScript tricks into it:

// ```js
// const params = Object.fromEntries(...new URL(request.url).searchParams);
// ```

// ---

// ### 1. `new URL(request.url)`

// * This constructs a **URL object** from the `request.url`.
// * The `URL` class is built into JavaScript (both in browsers and Node.js).
// * Example:

//   ```js
//   const url = new URL("https://example.com/page?foo=123&bar=hello");
//   ```

//   Now `url` has properties like:

//   * `url.hostname` → `"example.com"`
//   * `url.pathname` → `"/page"`
//   * `url.searchParams` → a special `URLSearchParams` object for the query string.

// ---

// ### 2. `.searchParams`

// * `url.searchParams` gives you a `URLSearchParams` object that represents the query string (`?foo=123&bar=hello`).
// * It behaves like a **Map**, so you can loop over it:

//   ```js
//   for (const [key, value] of url.searchParams) {
//     console.log(key, value);
//   }
//   // foo 123
//   // bar hello
//   ```

// ---

// ### 3. `Object.fromEntries(...)`

// * `Object.fromEntries` turns an **iterable of `[key, value]` pairs** into a plain JavaScript object.
// * Example:

//   ```js
//   const pairs = [["foo", "123"], ["bar", "hello"]];
//   const obj = Object.fromEntries(pairs);
//   console.log(obj);
//   // { foo: "123", bar: "hello" }
//   ```

// ---

// ### ✅ What the final result does

// Assuming the intended version (without the spread), it takes a URL like:

// ```
// https://mysite.com/page?user=alice&age=30
// ```

// and produces:

// ```js
// params = {
//   user: "alice",
//   age: "30"
// }
// ```

// ---

// ✨ Creative thought: This pattern is super handy for turning query strings into objects quickly. You can even extend it:

// ```js
// const params = Object.fromEntries(new URL(request.url).searchParams);
// const age = Number(params.age) || 0; // safely convert
// ```
