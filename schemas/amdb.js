// see also https://github.com/okgrow/merge-graphql-schemas

// DateTime: see https://github.com/graphql/graphql-js/issues/497

exports.types = `

  # A date/time.
  scalar DateTime

  # You can query on these types.
  type Query {
    # Get storage configuration.
      storage: [DataSphereResources]
  }


  # ResourceInterface: Common to every Resource.
  interface ResourceInterface {
    uoid: String!
    id: ResourceId!
  }
  
  # Resource identifier: a Type, human-usable name, optional human-usable description, internal unique object id "uoid" / key.
  type ResourceId {
    resourceType: ResourceType!,
    name: String!,
    description: String,
    uoid: String!
  }
   
  # Resource types.
  enum ResourceType {
    DATASPHERE
    COLLECTION
    SHARE
    STORAGE_GROUP
    NODE
    VOLUME
    USER
  }

  # Map all uoid => resource.
  type ResourceIndex {
    uoid: String!,
    resource: ResourceInterface!
  }
  
  
  # Transient containment relation.
  type ContainmentMap {
    container: ResourceId!,
    contains: [ ResourceId ]!
  }
  

  # All Resources in a DataSphere.
  type DataSphereResources implements ResourceInterface {
    id: ResourceId!,
    uoid: String!,
    shares: [StorageResource]!,
    collections: [StorageResource]!,
    storageGroups: [StorageResource]!,
    nodes: [StorageResource]!,
    volumes: [StorageResource]!
  }

  # A Physical or Logical Storage Resource (see storageType): Health, Capabilities, Activity.
  type StorageResource implements ResourceInterface {
    id: ResourceId!,
    uoid: String!,
    health: Health,
    capabilities: StorageCapabilities,
    mobility: DataMobility
  }
  
  
  # An entity is HEALTHY, or has conditions.
  type Health {
    status: HealthStatus,
    disorders: [UserMessage]
  }
  
  # Healthy - or maximum severity of disorder.
  enum HealthStatus {
    HEALTHY
    WARNING
    FAILED
  }

  # messageTemplate is a i18n translatable symbol; translation may embed dynamically from 'data[]'. 
  type UserMessage {
    severity: HealthStatus,
    messageTemplate: String,
    data: [String]!
  }


  # StorageCapabilities: collects filesystem, capacity, bandwidth, operation, and latency properties.
  type StorageCapabilities {
    filesystem: FilesystemCapabilities,
    capacities: Capacities,
    bandwidths: Bandwidths,
    operations: Operations,
    latencies:  Latencies
  }

  # FilesystemCapabilities: inode and compliance counts.  CompliantFiles = usedInodes - (nonCompliantFiles+severelyNonCompliantFiles).
  type FilesystemCapabilities {
    objectUoid: String!,
    totalInodes: Int,
    availableInodes: Int,
    usedInodes: Int,
    otherInodes: Int,
    nonCompliantFiles: Int,
    severelyNonCompliantFiles: Int
  }

  # Capacities in MegaBytes: current, thresholds, measurements
  type Capacities implements MeasurementsInterface, ThresholdInterface {
    objectUoid: String!,
    totalMB: Int,
    availableMB: Int,
    usedMB: Int,
    otherMB: Int,
    thresholds: [Threshold],
    measurements: [Measurement]
  }

  # Bandwidths in MegaBytesPerSecond: current, thresholds, measurements
  type Bandwidths implements MeasurementsInterface, ThresholdInterface {
    objectUoid: String!,
    readMBPerSecond: Int,
    writeMBPerSecond: Int,
    readMBPerSecondCapability: Int,
    writeMBPerSecondCapability: Int,
    thresholds: [Threshold],
    measurements: [Measurement]
  }  

  # Operations: current, thresholds, measurements.
  type Operations implements MeasurementsInterface, ThresholdInterface {
    objectUoid: String!,
    readPerSecond: Int,
    writePerSecond: Int,
    metaDataReadPerSecond: Int,
    metaDataWritePerSecond: Int,
    readPerSecondCapability: Int,
    writePerSecondCapability: Int,
    metaDataReadPerSecondCapability: Int,
    metaDataWritePerSecondCapability: Int,
    thresholds: [Threshold],
    measurements: [Measurement]
  }  

  # Latencies in milliseconds: current, thresholds, measurements.
  type Latencies implements MeasurementsInterface, ThresholdInterface {
    objectUoid: String!,
    readMs: Int,
    writeMs: Int,
    readMsCapability: Int,
    writeMsCapability: Int,
    thresholds: [Threshold]!,
    measurements: [Measurement]
  }  


  # Mobility measures and [in]active children.
  type DataMobility {
    mobilityMeasures: [MobilityMeasure],
    mostActiveChildUoids: [String]!,
    leastActiveChildUoids: [String]!
  }
  
  # Data moved to or from a partner.
  type MobilityMeasure implements MeasurementsInterface {
    objectUoid: String!,
    direction: Direction!,
    partnerUoid: String!,
    measurements: [Measurement]
  }
  
  # The direction of data flow.  Useful in a context with uoid and partnerUoid; relative to uioid.
  enum Direction {
    TO
    FROM
  }


  # MeasurementsInterface: Common to Measurement.
  interface MeasurementsInterface {
    objectUoid: String!,
    measurements: [Measurement]
  }
  
  # Something measured and its measurements.
  type Measurement {
    metric: Metric,
    values: [Float]!
  }
  
  # Something measurable, the timeSpan and sample count, the reduction function.
  type Metric {
    metricType: MetricType,
    metricUnit: MetricUnit,
    metricFunction: MetricFunction,
    timeSpan: TimeSpan!
  }
  
  # A measurable property. Multiple measurements may be reported by type: e.g. OPERATIONS may include read and write for METADATA and regular IO.
  enum MetricType {
    CAPACITIES
    BANDWIDTHS
    OPERATIONS
    LATENCIES
    TRANSFER
  }
  
  # Metric units.
  enum MetricUnit {
    MB
    PERCENT
    MBPS
    MS
    OPS
  }

  # A reduction function(array) => singleValue.
  enum MetricFunction {
    RAW
    AVERAGE
    MAXIMUM
  }


  # if end=0, end is "now".  default duration is 5*60*60*1000. if start=0, start is "now-duration". 
  type TimeSpan {
    startMs: Int,
    endMs: Int,
    durationMs: Int
  }

  
  # ThresholdInterface: Common to Threshold.
  interface ThresholdInterface {
    objectUoid: String!,
    thresholds: [Threshold]
  }

  # Threshold.
  type Threshold {
    unit: MetricUnit,
    warning: Int,
    severe: Int,
    timeSpan: TimeSpan,
    warningCount: Int,
    severeCount: Int
  }

`;

// NOTES:

// # native server timespan is always MILLISECONDS
// enum UiTimeSpan {
//     MILLISECOND
//     SECOND
//     MINUTE
//     HOUR
//     DAY
//     WEEK
//     MONTH
//     YEAR
//     FOREVER
// }

