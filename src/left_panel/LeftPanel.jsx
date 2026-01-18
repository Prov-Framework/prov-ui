import Card from 'react-bootstrap/Card';
import EntityList from './EntityList';
import ActivityList from './ActivityList';
import AgentList from './AgentList';

export default function LeftPanel() {
    return (
        <div className="leftPanel">
            <Card>
            <Card.Header className='entities-card-header'>Entities</Card.Header>
            <Card.Body>
                <EntityList />
            </Card.Body>
            </Card>
            <Card>
            <Card.Header className='activities-card-header'>Activities</Card.Header>
            <Card.Body>
                <ActivityList />
            </Card.Body>
            </Card>
            <Card>
            <Card.Header className='agents-card-header'>Agents</Card.Header>
            <Card.Body>
                <AgentList />
            </Card.Body>
            </Card>
        </div>
    );
}