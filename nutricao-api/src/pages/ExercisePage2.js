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
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [languageFilter, setLanguageFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    useEffect(() =>{
        async function fetchExercises() {
            const apiUrl = 'https://wger.de/api/v2/exerciseinfo/';
            const apiKey = process.env.REACT_APP_API_KEY;
        
            try {
                const response = await fetch(apiUrl, {
                  headers: {
                    Authorization: `Token ${apiKey}`,
                  },
                });
                const data = await response.json();
                // const filteredExercises = data.results.filter((exercise) =>
                //    exercise.translations.some((translation) => translation.language === 2)
                // );
                setExercises(data.results);
              } catch (error) {
                console.error('Error searching for exercises', error);
                return [];
              } finally {
                // setLoading(false);
              }
        }
        fetchExercises()
        setLoading(false);
    }, []);

    const filteredExercises = exercises.filter((exercise) => {
        return categoryFilter ? exercise.category === categoryFilter : true;
    });

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
                        <p style={{ fontSize: '18px' }}>Total de Exercícios: {filteredExercises.length}</p>
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
                            const filteredExercises = exercises.filter((exercise) =>
                                exercise.translations.some((translation) => translation.language === 2)
                            );
                            setExercises(filteredExercises);
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
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">Todas as Categorias</option>
                    <option value="Lógica">Lógica</option>
                    <option value="Algoritmos">Algoritmos</option>
                    <option value="Estruturas de Dados">Estruturas de Dados</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', padding: '16px' }}>
                {filteredExercises.map((exercise) => (
                    <div key={exercise.id} style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '320px', textAlign: 'center' }}>
                        <img
                            src={exercise.image}
                            alt={exercise.title}
                            style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                        />
                        <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 style={{ fontSize: '20px', margin: '8px 0' }}>{exercise.title}</h3>
                            <p style={{ fontSize: '14px', color: '#777' }}>{exercise.category}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '24px' }}>
                <button style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Anterior</button>
                <button style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Próxima</button>
            </div>
        </div>
    );
}

export default ExercisePage2;