import type { Filter, Sort } from "../utils/ticketUtils";

type FilterProps = {
  sort: Sort
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
  filter: Filter;
  setFilters: React.Dispatch<React.SetStateAction<Filter>>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
};

export default function FilterComponent({filter, sort, setSort, setFilters, searchInputRef}: FilterProps) {
  
  const filterHandleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sortOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target.value as Sort;

    setSort(target);
  }

  return (
    <div className="filter-container">
      <div className="filter-card">
        <div className="filter-group">
          <label className="label"> Search </label>
          <input
   
            name="search"
            placeholder="search ticket..."
            className="input"
            value={filter.search}
            ref={searchInputRef}
            onChange={filterHandleChange}
          />
        </div>
        <div className="filter-group">
          <label className="label"> Priority </label>
          <select
          
            name="priority"
            className="select"
            value={filter.priority}
            onChange={filterHandleChange}
          >
            <option value="all"> All </option>
            <option value="low"> Low </option>
            <option value="medium"> Medium </option>
            <option value="high"> High </option>
          </select>
        </div>
        <div className="filter-group">
          <label className="label"> Status </label>
          <select
           
            name="status"
            className="select"
            value={filter.status}
            onChange={filterHandleChange}
          >
            <option value="all"> All </option>
            <option value="closed"> Closed </option>
            <option value="open"> Open </option>
            <option value="in-progress"> In-Progress </option>
            <option value="done"> Done </option>
          </select>
        </div>
        <div className="filter-group">
          <label className="label">Sort</label>
          <select className="select" value={sort} onChange={sortOnChange}>
            <option value="createdAt-asc">Date Created (Lowest-Highest)</option>
            <option value="createdAt-desc">
              Date Created (Highest-Lowest)
            </option>
            <option value="updatedAt-asc">Date Updated (Lowest-Highest)</option>
            <option value="updatedAt-desc">
              Date Updated (Highest-Lowest)
            </option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="assignee-asc">Assignee (A-Z)</option>
            <option value="assignee-desc">Assignee (Z-A)</option>
            <option value="reporter-asc">Reporter (A-Z)</option>
            <option value="reporter-desc">Reporter (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
}