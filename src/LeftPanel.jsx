import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default function LeftPanel() {
    return (
        <div className="leftPanel">
            <Card>
            <Card.Header className='entities-card-header'>Entities</Card.Header>
            <Card.Body>
                <Button variant="outline-secondary">Entity 2</Button>
                <Button variant="outline-secondary">Entity 1</Button>
            </Card.Body>
            </Card>
            <Card>
            <Card.Header className='activities-card-header'>Activities</Card.Header>
            <Card.Body>
                <Button variant="outline-secondary">Activity 2</Button>
                <Button variant="outline-secondary">Activity 1</Button>
            </Card.Body>
            </Card>
            <Card>
            <Card.Header className='agents-card-header'>Agents</Card.Header>
            <Card.Body>
                <Button variant="outline-secondary">Person Agent</Button>
                <Button variant="outline-secondary">Organization Agent</Button>
            </Card.Body>
            </Card>
        </div>
    );
}