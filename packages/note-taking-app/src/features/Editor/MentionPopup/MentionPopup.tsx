import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { HighlightedText } from '@components/HighlightedText';
import { capitalize, debounce } from '@utils/common';
import { searchUsers } from '../api';

import './MentionPopup.css';

interface SuggestionProps {
  firstName: string;
  lastName: string;
  username: string;
  query: string;
}

function HighlightedSuggestion({ firstName, lastName, username, query }: SuggestionProps) {
  const regex = new RegExp(`^${query}`, 'i');
  const fullName = `${capitalize(firstName)} ${capitalize(lastName)}`;

  return (
    <span className="suggestion">
      <span className="suggestion__full-name">
        {regex.test(fullName) ?
          (<HighlightedText text={fullName} textToHighlight={capitalize(query)} />)
          : (
            <>
              <HighlightedText text={capitalize(firstName)} textToHighlight={capitalize(query)} />&nbsp;
              <HighlightedText text={capitalize(lastName)} textToHighlight={capitalize(query)} />
            </>
          )}
      </span>
      <span className="suggestion__username">
        @<HighlightedText text={username} textToHighlight={query} />
      </span>
    </span>
  );
}

interface PopupProps {
  onClear(): void;
  onAddMention(userName: string): void;
}

export function MentionPopup({ onClear, onAddMention }: PopupProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const usersQuery = useQuery({
    queryKey: ['users', query],
    queryFn: () => searchUsers(query)
  });
  const isSubmitting = useRef(false);
  const suggestionElementsRef = useRef<HTMLElement[]>([]);
  const selectedSuggestionRef = useRef<HTMLElement | null>(null);
  const suggestionsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onBlur({ relatedTarget }: FocusEvent) {
      if (!isSubmitting.current && (!relatedTarget || !containerRef.current?.contains(relatedTarget as Node))) {
        // blur is triggered when clicking on a user, timeout makes sure the onClick handler has a chance to run first
        setTimeout(onClear, 200);
      }
    }

    document.addEventListener('blur', onBlur, true);

    return () => {
      document.removeEventListener('blur', onBlur, true);
    };
  }, [ onClear ]);

  const handleChange = useMemo(() => debounce((value: string) => setQuery(value), 200, true), []);

  function handleKeyDown(event: React.KeyboardEvent) {
    const { key } = event;

    if (key === 'ArrowDown') {
      event.preventDefault();
      moveToNextSuggestion();
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      moveToPreviousSuggestion();
    }
  }

  function moveToNextSuggestion() {
    const list = suggestionElementsRef.current;
    const selected = selectedSuggestionRef.current;

    if (!list.length) return;

    if (!selected || list.indexOf(selected) === list.length - 1) {
      setSelectedSuggestion(0);
    } else {
      setSelectedSuggestion(list.indexOf(selected) + 1);
    }
  }

  function moveToPreviousSuggestion() {
    const list = suggestionElementsRef.current;
    const selected = selectedSuggestionRef.current;

    if (!list.length) return;

    if (!selected || list.indexOf(selected) === 0) {
      setSelectedSuggestion(list.length - 1);
    } else {
      setSelectedSuggestion(list.indexOf(selected) - 1);
    }
  }

  function setSelectedSuggestion(i: number) {
    const suggestion = suggestionElementsRef.current[i];
    selectedSuggestionRef.current = suggestion;
    suggestion.setAttribute('aria-selected', 'true');
    suggestionsContainerRef.current?.setAttribute('aria-activedescendant', suggestion.id);
    suggestion.focus();
  }

  function clearSuggestions() {
    suggestionsContainerRef.current?.setAttribute('aria-activedescendant', '');
    suggestionElementsRef.current = [];
    selectedSuggestionRef.current = null;
  }

  function submit(username: string) {
    isSubmitting.current = true;
    onAddMention(username);
  }

  return (
    <div className="add-mention" ref={containerRef} onKeyDown={handleKeyDown}>
      @
      <input
        aria-label="Search for a user to mention"
        name="search-users"
        autoFocus
        autoComplete='off'
        type="search"
        onChange={({ currentTarget }) => {
          clearSuggestions();
          handleChange(currentTarget.value);
        }}
      />
      <div
        ref={suggestionsContainerRef}
        className="add-mention__suggestions"
        role="listbox"
        aria-label="Select a user to mention"
      >
        {usersQuery.data?.map(({ first_name, last_name, username }) => (
          <button
            id={username}
            ref={(el) => {
              if (el) {
                suggestionElementsRef.current.push(el);
              }
            }}
            role="option"
            tabIndex={-1}
            key={username}
            onClick={() => {
              submit(username);
            }}
          >
            <HighlightedSuggestion firstName={first_name} lastName={last_name} username={username} query={query} />
          </button>
        ))}
        {usersQuery.data?.length === 0 && <i>No user found</i>}
      </div>
    </div>
  );
}
