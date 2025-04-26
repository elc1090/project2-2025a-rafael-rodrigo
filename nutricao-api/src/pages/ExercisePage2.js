import { useState, useEffect } from "react";


const exercises = [
    {
        id: 1,
        title: "Exercício 1",
        category: "Lógica",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 2,
        title: "Exercício 2",
        category: "Algoritmos",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        title: "Exercício 3",
        category: "Estruturas de Dados",
        image: "https://via.placeholder.com/150",
    },
];

function ExercisePage2() {
    const imageNotFoundImage = (
        <svg
                    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1p9wzm4 exercise-placeholder"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5z"></path>
                  </svg>
    )
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [languageFilter, setLanguageFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [categories, setCategories] = useState([]);
    const [nextExercisesLink, setNextExercisesLink] = useState(null);

    useEffect(() =>{
        async function fetchExercises() {
            const apiUrl = 'https://wger.de/api/v2/exerciseinfo/';
            const apiCategoryUrl = 'https://wger.de/api/v2/exercisecategory/';
            const apiKey = process.env.REACT_APP_API_KEY;
        
            try {
                let response = await fetch(apiUrl, {
                  headers: {
                    Authorization: `Token ${apiKey}`,
                  },
                });
                let data = await response.json();
                setExercises(data.results);
                setNextExercisesLink(data.next);

                // procura as categorias
                response = await fetch(apiCategoryUrl, {
                    headers: {
                        Authorization: `Token ${apiKey}`,
                    }
                });
                data = await response.json();
                setCategories(data.results.map((category) => {
                    return category.name
                }));
              } catch (error) {
                console.error('Error searching for exercises', error);
                return [];
              } finally {
                // setLoading(false);
              }
        }
        fetchExercises()
        setFilteredExercises(exercises);
        setLoading(false);
    }, []);

    let effectiveExercises = exercises.filter((exercise) => {
        return categoryFilter ? exercise.category.name === categoryFilter : true;
    });
    effectiveExercises = effectiveExercises.filter((exercise) => {
        return languageFilter ? exercise.translations.some((translation) => translation.language === parseInt(languageFilter)) : true;
    });
    console.log("Effective exercises: ", effectiveExercises);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: '#ccc', padding: '24px 0', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                Exercícios
            </div>

            {
                loading ? (
                    <div style={{ textAlign: 'center', padding: '24px' }}>
                        <p style={{ fontSize: '18px' }}>Carregando...</p>
                    </div>
                ) : (
                    <div style={{ padding: '24px', textAlign: 'center' }}>
                        <p style={{ fontSize: '18px' }}>Total de Exercícios: {effectiveExercises.length}</p>
                    </div>
                )
            }

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px', justifyContent: 'center' }}>
                <select
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}
                    value={languageFilter}
                    onChange={
                        (e) => {
                            setLanguageFilter(e.target.value)
                        }
                    }
                >
                    <option value="">Todas as Línguas</option>
                    <option value="1">Alemão</option>
                    <option value="2">Inglês</option>
                </select>

                <select
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}
                    value={categoryFilter}
                    onChange={(e) => {
                        setCategoryFilter(e.target.value)
                    }}
                >
                    <option value="">Todas as Categorias</option>
                    {
                        categories.map((category) => {
                            return (
                                <option key={category} value={category}>{category}</option>
                            )
                        })
                    }
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', padding: '16px' }}>
                {
                effectiveExercises.map((exercise) => {
                    const englishTranslation = exercise.translations.find(
                        (translation) => translation.language === 2
                    );
                    const name = englishTranslation?.name || 'Name not available';
                    const categories = exercise.category.name || 'Category not available';
                    const image = exercise.images.length > 0 ? exercise.images[0].image : imageNotFoundImage;

                    return (
                        <div key={name} style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '320px', textAlign: 'center' }}>
                            {
                                exercise.images.length > 0 ? (
                                    <img
                                        src={image}
                                        alt={name}
                                        style={{ width: '100%', height: '160px', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <div style={{ width: '50%', height: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                                        {image}
                                    </div>
                                )
                            }
                        <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 style={{ fontSize: '20px', margin: '8px 0' }}>{name}</h3>
                            <p style={{ fontSize: '14px', color: '#777' }}>{categories}</p>
                        </div>
                    </div>
                    );
                })
                }
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '24px' }}>
                <button style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', background: '#007bff', color: 'white', cursor: 'pointer' }}
                onClick={() => {
                    async function loadMore() {
                        const apiKey = process.env.REACT_APP_API_KEY;
                        try{
                            const response = await fetch(nextExercisesLink, {
                                headers: {
                                    Authorization: `Token ${apiKey}`,
                                },
                            });
                            const data = await response.json();
                            const newEx = exercises.concat(data.results);
                            setExercises(newEx);
                            setNextExercisesLink(data.next);
                        }catch(error){

                        }finally{

                        }
                    }

                    setLoading(true);
                    loadMore();
                    setLoading(false);
                }}>Carregar mais</button>
            </div>
        </div>
    );
}

export default ExercisePage2;