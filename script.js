const matchesElement = document.getElementById('matches');
const totalDiv = document.getElementById('total');
const addNewMatch = document.getElementById('addNewMatch');
const resetTrigger = document.getElementById('reset');

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const NEW_MATCH = 'NEW_MATCH';
const RESET = 'RESET';

const initialState = {
  matches: [
    {
      id: 1,
      score: 0,
    },
  ],
};

const matchReducer = (state = initialState, action) => {
  switch (action.type) {
    case NEW_MATCH: {
      const id = state.matches.length + 1;
      const score = 0;
      const newMatch = {
        id,
        score,
      };
      const matches = [...state.matches, newMatch];
      return { ...state, matches };
    }
    case INCREMENT: {
      const { id, value } = action.payload;
      const matches = state.matches.map((match) => {
        if (match.id === parseInt(id)) {
          return {
            ...match,
            score: match.score + value,
          };
        } else {
          return match;
        }
      });
      return { ...state, matches };
    }
    case DECREMENT: {
      const { id, value } = action.payload;
      const matches = state.matches.map((match) => {
        if (match.id === id) {
          const newScore = match.score - value;
          return {
            ...match,
            score: newScore < 0 ? 0 : newScore,
          };
        } else {
          return match;
        }
      });
      return { ...state, matches };
    }
    case RESET: {
      const matches = state.matches.map((match) => {
        return {
          ...match,
          score: 0,
        };
      });
      return { ...state, matches };
    }
    default:
      return state;
  }
};

const store = Redux.createStore(matchReducer);

const renderMatch = (match) => {};

function getInputData(e, inputName) {
  const formData = new FormData(e.target);
  const submittedValue = formData.get(inputName);
  return submittedValue;
}

const incrementScore = (id, value) => ({
  type: INCREMENT,
  payload: { id, value },
});

const decrementScore = (id, value) => ({
  type: DECREMENT,
  payload: { id, value },
});

function handleIncrementValue(e) {
  e.preventDefault();
  const parent = e.target.closest('[data-id]');
  const id = parseInt(parent.dataset.id);
  const inputName = 'increment';
  const value = parseInt(getInputData(e, inputName));
  store.dispatch(incrementScore(id, value));
}

function handleDecrementValue(e) {
  e.preventDefault();
  const parent = e.target.closest('[data-id]');
  const id = parseInt(parent.dataset.id);
  const inputName = 'decrement';
  const value = parseInt(getInputData(e, inputName));
  store.dispatch(decrementScore(id, value));
}

resetTrigger.addEventListener('click', () => {
  store.dispatch(resetScores());
});

const renderMatches = () => {
  const matches = store.getState().matches;
  matchesElement.innerHTML = '';
  matches.forEach((match) => {
    const matchDiv = document.createElement('div');
    matchDiv.classList.add('match');
    matchDiv.dataset.id = match.id;
    matchInnerHtml = `
            <div class="wrapper">
                <button class="lws-delete">
                    <img src="./image/delete.svg" alt="" />
                </button>
                <h3 class="lws-matchName">Match ${match.id}</h3>
            </div>
            <div class="inc-dec">
                <form class="incrementForm" onsubmit="handleIncrementValue(event)">
                    <h4>Increment</h4>
                    <input
                        type="number"
                        name="increment"
                        class="lws-increment"
                        placeholder='0'
                    />
                </form>
                <form class="decrementForm" onsubmit="handleDecrementValue(event)">
                    <h4>Decrement</h4>
                    <input
                        type="number"
                        name="decrement"
                        class="lws-decrement"
                        placeholder='0'
                    />
                </form>
            </div>
            <div class="numbers">
                <h2 class="lws-singleResult" id="total">${match.score}</h2>
            </div>`;
    matchDiv.innerHTML = matchInnerHtml;
    matchesElement.append(matchDiv);
  });
};

renderMatches();

store.subscribe(renderMatches);

addNewMatch.addEventListener('click', () => {
  store.dispatch(createMatch());
});

const createMatch = () => {
  return {
    type: NEW_MATCH,
  };
};

const resetScores = () => ({
  type: RESET,
});
